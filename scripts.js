$(".vertical-tab .each-tab").on("click", function (e) {
    var dis = $(this),
        dataTarget = dis.data("target");

    // Tabs switch
    dis.addClass("active").siblings(".each-tab").removeClass("active");

    // Content switch
    $(".vertical-tab-wrapper .vertical-tab-content").hide().removeClass("active");
    $(dataTarget).show().addClass("active");
});
