import { Actions } from "@jsonforms/core";
import yaml from "js-yaml";
import { Store } from "redux";

const $RefParser = require("@apidevtools/json-schema-ref-parser");

const isYAML = process.env.YAML_SOURCE || true;

let schemaURL: string = "",
  uischemaURL: string = "";

if (isYAML) {
  schemaURL = "schema/schema.yaml";
  uischemaURL = "schema/uischema.yaml";
} else {
  schemaURL = "schema/schema.json";
  uischemaURL = "schema/uischema.json";
}

schemaURL =
  new URLSearchParams(window.location.search).get("url_schema") || schemaURL;
uischemaURL =
  new URLSearchParams(window.location.search).get("url_uischema") ||
  uischemaURL;

const fetchSchema = async (url: string, dereference: boolean = false) => {
  const text = await (await fetch(url)).text();
  const out = yaml.safeLoad(text);

  console.debug(url, out);

  if (!dereference) return out;

  try {
    return await $RefParser.dereference(out);
  } catch (err) {
    console.error("Cannot dereference", err);
    throw err;
  }
};

export const loadSchema = (store: Store) => {
  fetchSchema(schemaURL).then((schemaRetrieved) => {
    console.debug("schemaRetrieved", schemaRetrieved);

    $RefParser.dereference(schemaRetrieved, (err: any, schema: any) => {
      if (err) {
        console.error(err);
        throw err;
      }
      fetchSchema(uischemaURL, true).then((uischema) => {
        console.debug("uischemaRetrieved", uischema);

        const dataC = uischema._meta?.data || {};
        store.dispatch(Actions.init(dataC, schema, uischema));
      });
    });
  });
};
