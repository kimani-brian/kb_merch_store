/** Odoo many2one reference serialized as [id, "Name"] tuple. */
export type M2ORef = [number, string] | null;

export interface OdooRoute {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  page_type: "category" | "landing" | "product_grid" | string;
  seo_title: string | false | null;
  seo_description: string | false | null;
  sequence: number;
  active: boolean;
}

export interface OdooProduct {
  id: number;
  name: string;
  default_code: string | false | null;
  handle: string;
  list_price: number;
  categ_id: M2ORef;
  description_sale: string | false | null;
  image_url: string;
  qty_available: number;
  sale_ok: boolean;
  attributes: OdooProductAttribute[];
  variants: OdooProductVariant[];
  create_date?: string;
}

export interface OdooProductAttributeValue {
  id: number;
  name: string;
}

export interface OdooProductAttribute {
  id: number;
  name: string;
  create_variant: "always" | "dynamic" | "no_variant" | string;
  values: OdooProductAttributeValue[];
}

export interface OdooProductVariantAttribute {
  attribute_id: number;
  attribute: string;
  value_id: number;
  value: string;
}

export interface OdooProductVariant {
  id: number;
  name: string;
  default_code: string | false | null;
  qty_available: number;
  sale_ok: boolean;
  attributes: OdooProductVariantAttribute[];
}

export interface OdooCategory {
  id: number;
  name: string;
  parent_id: M2ORef;
  products_count: number;
}
