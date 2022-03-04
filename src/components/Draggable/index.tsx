import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';

type Position = {
  x: number;
  y: number;
};

type DraggableProps = {
  children: ReactNode;
  customWidth?: string;
  customHeight?: string;
  defaultPosition: Position;
};

type StyledDraggableProps = {
  customWidth: string;
  customHeight: string;
  clientX: number;
  clientY: number;
};

const StyledDraggable = styled.div<StyledDraggableProps>`
  width: ${({ customWidth }) => customWidth};
  height: ${({ customHeight }) => customHeight};
  background-color: rgb(29, 29, 33);

  .draggable-item {
    position: absolute;
    display: flex;
    cursor: move;
    left: ${({ clientX }) => clientX + 'px'};
    top: ${({ clientY }) => clientY + 'px'};
  }
`;

type DragState = {
  isDrag: boolean;
  mouseX: number | null;
  mouseY: number | null;
};

function Draggable({
  children,
  customWidth = '100%',
  customHeight = '100%',
  defaultPosition,
}: DraggableProps) {
  const initialState = { isDrag: false, mouseX: null, mouseY: null };
  const [dragState, setDragState] = useState<DragState>(initialState);
  const [mousePosition, setMousePosition] = useState<Position>(defaultPosition);
  const [position, setPosition] = useState<Position>(defaultPosition);

  const onDragStart = (data: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragState({
      isDrag: true,
      mouseX: data.clientX - position.x,
      mouseY: data.clientY - position.y,
    });
  };

  const onDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const onDragStop = () => {
    setDragState(initialState);
  };

  useEffect(() => {
    if (!dragState.isDrag || dragState.mouseX === null || dragState.mouseY === null) return;

    setPosition({ x: mousePosition.x - dragState.mouseX, y: mousePosition.y - dragState.mouseY });
  }, [dragState, mousePosition]);

  return (
    <StyledDraggable
      customWidth={customWidth}
      customHeight={customHeight}
      clientX={position.x}
      clientY={position.y}
      onMouseMove={(e) => onDrag(e)}
    >
      <div className="draggable-item" onMouseDown={(e) => onDragStart(e)} onMouseUp={onDragStop}>
        {children}
      </div>
    </StyledDraggable>
  );
}

export default Draggable;
