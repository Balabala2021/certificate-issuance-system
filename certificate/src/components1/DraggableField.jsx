import { useDrag } from "react-dnd";

const DraggableField = ({ id, left, top, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left,
        top,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      {children}
    </div>
  );
};

export default DraggableField;
