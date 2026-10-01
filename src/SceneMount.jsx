import { Suspense, useState } from "react";
import useIsMobile from "./useIsMobile";

export default function SceneMount({
  label = "Activer la scène interactive",
  className = "",
  children,
  desktopOnly = false,
}) {
  const mobile = useIsMobile();
  const [active, setActive] = useState(false);

  if (desktopOnly && mobile) {
    return (
      <div className={`scene-mount scene-mount--static ${className}`.trim()} aria-hidden="true">
        <div className="scene-mount__veil">
          <p>Scène 3D disponible sur ordinateur — le parcours reste lisible ici.</p>
        </div>
      </div>
    );
  }

  if (mobile && !active) {
    return (
      <div className={`scene-mount scene-mount--gated ${className}`.trim()}>
        <div className="scene-mount__veil">
          <p>Scène interactive (WebGL) — activez-la seulement si vous voulez l’explorer.</p>
          <button type="button" className="scene-mount__btn" onClick={() => setActive(true)}>
            {label}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className={`scene-fallback ${className}`.trim()} aria-hidden="true" />}>
      {children}
    </Suspense>
  );
}
