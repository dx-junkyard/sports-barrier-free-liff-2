import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PageProps } from "@/pages/_app";
import { Events } from "@/pages/events/index";
import { TitleContentActionLayout } from "@/components/title-content-action-layout";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export interface Owner {
  id: string;
  name: string;
}

interface OwnerCheckboxes extends Owner {
  _checked: boolean;
  _disabled: boolean;
}

const QRPage: NextPage<PageProps> = ({ pb, pbUser }) => {
  const [eventId, setEventId] = useState<string>('');
  const [owners, setOwners] = useState<Record<string, OwnerCheckboxes>>({});
  const [selectedValues, setSelectedValues] = useState<OwnerCheckboxes[]>([]);

  const router = useRouter();

  // owners
  const handleChange = useCallback(
    (id: string) => {
      const owner = owners[id];
      if (!owner) throw Error("facilities id not found");

      owner._checked = !owner._checked;

      setOwners({ ...owners, [id]: owner });
    },
    [owners]
  );

  const handleSubmit = useCallback(() => {

    const ownerIds = selectedValues.map(x => x.id)
    router.push({
      pathname: "/scan/facility",
      query: {
        owner_ids: JSON.stringify(ownerIds),
        event_id: eventId
      }
    })
  },[selectedValues])


  // computed value
  useEffect(() => {
    setSelectedValues(
      Object.values(owners).filter((item) => item._checked)
    )
  }, [owners])


  useEffect(() => {
    console.log(router.query);
    // @ts-ignore
    setEventId(router.query.event_id || '');
    ;(async () => {
      if (!pb) return;

      // fetch equipments
      const list = await pb
        .collection("owner")
        .getFullList({ $autoCancel: false });

      // apply to state
      const owners = Object.fromEntries(
        list.map((item) => [
          item.id,
          {
            id: item.id,
            name: item.name,
            _checked: false,
            _disabled: false,
          },
        ])
      );
      setOwners(owners);
    })();
  }, [pb]);

  // render
  return (
    <TitleContentActionLayout
      title="場所を選ぶ"
      submitText="登録"
      canSubmit={true}
      onSubmit={handleSubmit}
    >
      <FormGroup>
        {Object.values(owners).map((item) => (
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                checked={item._checked}
                disabled={item._disabled}
                onChange={() => handleChange(item.id)}
              />
            }
            label={`${item.name}`}
          />
        ))}
      </FormGroup>
      {/* <pre>{JSON.stringify(owners, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(selectedValues, null, 2)}</pre> */}
    </TitleContentActionLayout>
  );
};

export default QRPage;
