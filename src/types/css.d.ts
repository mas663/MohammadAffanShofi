declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.css" {
  const styles: Record<string, string>;
  export = styles;
}
