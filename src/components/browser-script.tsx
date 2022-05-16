import { jsxte_ssc_init } from "../browser-script/jsxte-ssc";

export const BrowserScript: JSX.Component = () => {
  return (
    <script>
      {jsxte_ssc_init.toString() /*.replace(/\n/g, "").replace(/\s+/g, " ")*/}
      {`${jsxte_ssc_init.name}();`}
    </script>
  );
};
