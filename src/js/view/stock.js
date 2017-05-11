
;(function(){
  App.defineViewModel("#stock",{
       data:{
           stock_code:null,
           realRES:null,
           info_tab:null,
           company_tab:null,
           company_newsRES:null,
           company_news_page:null,
           company_announcementRES:null,
           company_announcement_page:null,
           company_researchRES:null,
           company_research_page:null,
           f10_company_profileRES:null,
           company_financeRES:null,
           Number:Number,

           chart_tab:null,

           five_tab:null,
           tickRES:null
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
           },
           chart_tab:function (tab) {
               clearInterval(this._drawTimelineInterval);
               var that = this;
               switch(tab){
                   case 1:
                       drawTimeline.call(that);
                       this._drawTimelineInterval = setInterval(function () {
                           drawTimeline.call(that);
                       },60*1000);
                       this.five_tab = 1;
                       break;
                   case 2:
                       drawTimeline.call(this,5);
                       break;
                   case 3:
                       drawKLine.call(this,6);
                       break;
                   case 4:
                       drawKLine.call(this,7);
                       break;
                   case 5:
                       drawKLine.call(this,8);
                       break;
                   case 6:
                       drawKLine.call(this,2);
                       break;
               }
           },
           five_tab:function (tab) {
               if(tab==2){
                   //分笔数据更新
                   var that = this;
                   API.tick(this.stock_code).then(function (data) {
                       data = data.tick;
                       that.tickRES = data[that.stock_code];
                   })
               }
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
                   data = data.data.snapshot;
                   console.log(data);
                   data.fields.forEach(function (v,k) {
                       res[v] = data[code][k];
                   });
                   res.bid_grp = res.bid_grp.split(',');
                   res.offer_grp = res.offer_grp.split(',');
                   that.realRES = res;
               })
           },
           processNum: function (num, scale) {
               num = Number(num);
               scale = scale==0? 0:2;
               if(num>100000000){
                   return (num/100000000).toFixed(scale)+"亿";
               }

               if(num>10000){
                   return (num/10000).toFixed(scale)+"万";
               }

               return Number(num);
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
    function drawKLine(type) {
        var that  = this;
        var code = that.stock_code;
        API.kline(code,type).then(function (quote) {
            console.log("drawKLine");
            console.log(quote);
            var kdata = [];
            quote.data.candle[code].forEach(function(data){
                kdata.push({
                    time:data[0],
                    open_px:data[1],
                    high_px:data[2],
                    low_px:data[3],
                    close_px:data[4],
                    business_amount:data[5],
                    business_balance:data[6]
                });
            });
            LIGHT.Components.StockChart({
                type:"k",
                canvas:{
                    chart:that.$els['stock_chart_k_'+type]
                },
                data:kdata,
                options:{
                    font:"normal 10px monospace",
                    animation:0,
                    chart:{
                        ma5line:{
                            borderColor:"black"
                        },
                        ma10line:{
                            borderColor:"green"
                        },
                        ma20line:{
                            borderColor:"red"
                        },
                        ma60line:{
                            borderColor:"yello",
                        }
                    },
                    colors:{
                        rise:"#FB3C01",
                        fall:"#32A632",
                        normal:"#999",
                        label:"#999",
                        gridLine:"#444"
                    },
                    size:{
                        chart:110,
                        volume:40
                    }
                }
            });
        });
    }

    function drawTimeline(day) {
        var code = this.stock_code;
        var data_mins = [];
        var data_quote;
        var that = this;

        var func = "trend";
        if(day) func = "trend5day";

        Promise.all([API.real(code),API[func](code)]).then(function (data) {
            console.log("===============================");
            console.log(data);
            data[1].data.trend[code].forEach(function(data,index,t){
                data_mins.push({
                    min_time:data[0],
                    last_px:data[1],
                    business_amount:data[2],
                    business_balance:data[3],
                    avg_px:data[4]
                })
            });

            var quote = {};
            data[0].data.snapshot.fields.forEach(function (o,i) {
                quote[o] = data[0].data.snapshot[code][i];
            });

            data_quote={
                time:quote.data_timestamp,
                open: quote.open_px,
                preClose: quote.preclose_px,
                highest: quote.high_px,
                lowest: quote.low_px,
                price: quote.last_px,
                volume: quote.business_amount,
                amount: quote.business_balance
            };

            LIGHT.Components.StockChart({
                type:"time",
                canvas:{
                    chart:that.$els["stock_chart_"+func],
                },
                data:{
                    quote:data_quote,
                    mins:data_mins
                },
                options:{
                    font:'8px Arial',
                    chart:{
                        points:data_mins.length>241?data_mins.length:241,
                        maline:{
                            borderColor:"rgba(155,124,56,1)"
                        },
                        timeline:{
                            borderColor:"rgba(5,164,199,1)",
                            fillColor:'#333'
                        },
                        xScaler:['09:30', '15:00']
                    },
                    colors:{
                        rise:"red",
                        fall:"green",
                        normal:"#fff",
                        gridLine:"#444"
                    },
                    size:{
                        chart:100,
                        volume:50
                    }
                }
            });
        });
    }
})();
