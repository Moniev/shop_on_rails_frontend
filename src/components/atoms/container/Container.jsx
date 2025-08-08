import classNames from "classnames";
import "./Container.scss";

const Container = ({ children, row, itemsCenter, className }) => {
  return (
    <div
      className={classNames("cont", className, {
        row,
        "items-center": itemsCenter,
      })}
    >
      {children}
    </div>
  );
};

export default Container;