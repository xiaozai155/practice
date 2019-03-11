$(function() {
    function pageInit() {
        fetchData();
    }

    function fetchData() {
        var params = {"detail":{"model":"Shopv2","action":"getDetail","parameters":{"gid":"105553"}},"comment":{"model":"Comment","action":"getList","parameters":{"goods_id":"105553","orderby":"1","pageindex":"0","pagesize":3}},"activity":{"model":"Activity","action":"getAct","parameters":{"gid":"105553"}}};
        $.Ajax(params, function(data) {
            console.log(data);
            render(data);
        }, () => toast('加载活动列表失败'), '/app/shop/pipe');
    }

    function render(data) {

    }

    pageInit();
});
