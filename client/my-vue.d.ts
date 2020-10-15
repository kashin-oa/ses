declare module '*.vue' {
  import Vue from 'vue';
  import * as custom from '*.vue';

  type mod = Vue & typeof custom;

  export default mod;
}
