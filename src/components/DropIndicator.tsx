type DropIndicatorProps = {
  beforeId: string | null;
  columnId: string;
};

const DropIndicator = ({ beforeId, columnId }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={columnId}
      className="my-0.5 h-0.5 w-full first:mt-0 mt-[-9px] mb-[-9px] bg-violet-400 opacity-0 flex-shrink-0"
    />
  );
};

export default DropIndicator;
