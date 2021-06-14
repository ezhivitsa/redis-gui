declare namespace GlobalPcssNamespace {
  export interface IGlobalPcss {
    Hello: string;
  }
}

declare const GlobalPcssModule: GlobalPcssNamespace.IGlobalPcss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GlobalPcssNamespace.IGlobalPcss;
};

export = GlobalPcssModule;
