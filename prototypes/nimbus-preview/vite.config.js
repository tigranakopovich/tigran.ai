import {defineConfig} from 'vite';
export default defineConfig({
 base:'./',
 build:{target:'es2022',outDir:'dist',emptyOutDir:true,rolldownOptions:{output:{codeSplitting:{groups:[
  {name:'three-core',test:/three[\\/]build[\\/]three\.core\.js/},
  {name:'three-renderer',test:/three[\\/]build[\\/]three\.module\.js/}
 ]}}}},
 preview:{host:'127.0.0.1',port:4176,strictPort:true}
});
