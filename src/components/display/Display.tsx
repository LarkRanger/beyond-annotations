import { HTMLAttributes, useEffect, useRef } from 'react';
import { useStore } from 'hooks';
import {
  ReactZoomPanPinchRef,
  TransformWrapper,
  TransformComponent,
} from 'react-zoom-pan-pinch';
import { Annotation } from 'components';
import { observer } from 'mobx-react-lite';
import './styles.css';

function DisplayInner(props: HTMLAttributes<HTMLDivElement>) {
  const store = useStore();
  const ref = useRef<ReactZoomPanPinchRef>(null);

  function onZoom(ref: ReactZoomPanPinchRef) {
    store.scale = ref.state.scale;
  }

  useEffect(() => {
    ref.current?.centerView(store.initialScale);
  }, [store.imageDimensions, store.initialScale]);

  return (
    <div {...props} id={store.elementIds.displayWrapper}>
      <TransformWrapper
        disabled={store.isPanDisabled}
        wheel={{ step: 0.05 }}
        onZoom={onZoom}
        centerOnInit={true}
        minScale={store.initialScale}
        initialScale={store.initialScale}
        ref={ref}>
        <TransformComponent
          wrapperClass={`${store.elementIds.transformWrapper} annotation-transform-wrapper`}
          contentClass={`${store.elementIds.transformComponent} annotation-transform-component`}>
          <svg
            width={store.imageDimensions.width}
            height={store.imageDimensions.height}
            id={store.elementIds.imageWrapper}
            xmlns='http://www.w3.org/2000/svg'
            onContextMenu={event => event.preventDefault()}>
            <image
              width={store.imageDimensions.width}
              height={store.imageDimensions.height}
              href={store.imageSrc}
              style={{ verticalAlign: 'middle' }}
            />
            {store.visibleUserAnnotations.map(annotation => (
              <Annotation key={annotation.id} annotation={annotation} />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export const Display = observer(DisplayInner);
