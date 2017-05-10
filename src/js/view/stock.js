
;(function(){
  App.defineViewModel("#stock",{
       data:{
           stock_code:null,
           realRES:null,
           info_tab:null,
           company_tab:null,

           chart_tab:null
       },
       watch:{
           stock_code:function (code){
               var that = this;
               that.real(code);
               setInterval(function () {
                   that.real(code);
               },3000);
               this.info_tab = 1;
               this.company_tab=1;
               this.chart_tab=1;
           }
       },
       methods:{
           real: function (code) {
               var res = {};
               var dat={};
               var that = this;
               API.real(code).then(function (data) {
                   // console.log("stock.js中的log \n");
                   // console.log(data);
                   dat = data.data.snapshot;
                   // console.log(dat);
                   dat.fields.forEach(function (v,k) {
                       res[v] = dat[code][k];
                   });
                   res.bid_grp = res.bid_grp.split(',');
                   res.offer_grp = res.offer_grp.split(',');
                   that.realRES = res;
               })
           }
       }
     },{
     ready:function(){
     },
     beforeRender:function (params) {
         this.model.stock_code=params.code || "600570.SS";
     },
     afterRender:function (params){
     },
     beforeUnRender:function (){
     },
     afterUnRender:function (){
     }
  });
})();
