import { useSubs } from '../hooks/useSubs.ts';
import CreatableSelect from 'react-select/creatable';
import { useRef, useState } from 'react';

export const SubSelect = ({
  onChange,
  values,
}: {
  onChange: (ids: number[]) => void;
  values: number[];
}) => {
  const { data, isLoading, addSub, refetch, isRefetching } = useSubs();
  const [createLoading, setCreateLoading] = useState(false);
  const ref = useRef<null | HTMLDivElement>(null);
  const disabled = isLoading || createLoading || isRefetching;
  const options =
    data?.map(({ name, id }) => ({
      label: name,
      value: id,
    })) || [];

  const selected = values.map((id) => ({
    label: data?.find((datum) => datum.id === id)?.name ?? '',
    value: id,
  }));
  return (
    <div ref={ref}>
      <CreatableSelect
        className={'custom-select '}
        classNamePrefix={'custom-select'}
        isClearable={true}
        isMulti={true}
        isDisabled={disabled}
        isLoading={disabled}
        options={options}
        onChange={(newValues) => {
          onChange(newValues?.map(({ value }) => +value) ?? []);
        }}
        onFocus={() => {
          if (ref.current) {
            ref.current.scrollIntoView({
              behavior: 'smooth',
            });
          }
        }}
        onCreateOption={async (value) => {
          setCreateLoading(true);
          const { data } = await addSub(value);
          if (data) {
            onChange([...values, data.id]);
          }
          await refetch();
          setCreateLoading(false);
        }}
        value={selected}
      />
    </div>
  );
};
