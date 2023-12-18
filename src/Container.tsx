import { signal } from "@preact/signals-react";

const count = signal(0);

const Container = () => {
  return (
    <div>
      Container
      {count.value}
    </div>
  );
};

export default Container;
