;(function (win) {
    win.API = {

        real: function (code) {
            return execute("quote/v1/real", {
                en_prod_code: code,
                fields: "prod_name,last_px,px_change,px_change_rate,open_px,preclose_px,business_amount,turnover_ratio,high_px,low_px,business_balance,business_amount_in,business_amount_out,market_value,pe_rate,amplitude,circulation_value,bid_grp,offer_grp"
            });
        },
        tick: function (code) {
            return execute("quote/v1/tick", {
                prod_code: code,
                data_count:10
            });
        },
        kline: function (code,type) {
            return execute("quote/v1/kline", {
                get_type:"offset",
                prod_code:code,
                candle_period:type,
                fields:"open_px,high_px,low_px,close_px,business_amount,business_balance",
                data_count:200
            });
        },
        trend: function (code) {
            return execute("quote/v1/trend", {
                prod_code: code,
                fields: "last_px,business_amount,business_balance,avg_px"
            });
        },
        trend5day: function (code) {
            return execute("quote/v1/trend5day", {
                prod_code: code,
                fields: "last_px,business_amount,business_balance,avg_px"
            });
        }
    };

    var prefix = "http://api.hscloud.cn/";
    function execute(func, params) {
        return new Promise(function (resolve, reject) {
            Light.ajax({
                type:"get",
                url:prefix + func,
                headers: {
                    "Authorization": "Bearer " + API.access_token
                },
                dataType: "json",
                data: params,
                success: function (data) {
                    resolve(data, data);
                },
                error: function (err) {
                    reject(err);
                }
            })
        })
    }
})(window);