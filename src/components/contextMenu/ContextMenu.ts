import { observer } from 'mobx-react-lite';
import { PropsWithChildren } from 'react';
import { UserAnnotation } from 'stores';

interface ContextMenuProps extends PropsWithChildren<any> {
  annotation: UserAnnotation;
}

function ContextMenuInner({ annotation, children }: ContextMenuProps) {
  return children;
}

export const ContextMenu = observer(ContextMenuInner);
