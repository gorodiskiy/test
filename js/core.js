// var JQscript = document.createElement("script");
// JQscript.src = 'https://cases.in.ua/jquery-3.4.1.min.js'; 
// document.head.appendChild(JQscript); 

// var Cartscript = document.createElement("script");
// Cartscript.src = 'https://cases.in.ua/jquery-3.4.1.min.js'; 
// document.head.appendChild(Cartscript); 
// Cartscript.onload = function () {
// console.log("Cartscript");
// };

// var vendorsJS = document.createElement("script");
// vendorsJS.src = 'https://cases.in.ua/vendors.js';
// document.head.appendChild(vendorsJS);
// vendorsJS.onload = function() {
//     console.log("vendorsJS");
// };





$(document).ready(function () {

    // получаем параметры из ссылки
    var href = document.location.href;
    console.warn("href", href);
    // https://iphone-cases.in.ua/games/index.php?cat=art
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        url = href,
        url_params = {},
        match;
    while (match = regex.exec(url)) {
        url_params[match[1]] = match[2];
    }
    /* if (href.indexOf('games') > -1){
    console.warn("games");
    } */
    var url_cat = '';
    for (var param in url_params) {
        if (param == 'cat') {
            url_cat = url_params[param];
        }
        console.log("param " + param + " value " + url_params[param]);
    }

    console.warn("href params", url_params);


    function urlcat() {
        // проверяем есть ли в параметрах ссылки категория	
        var urlcat = ''
        for (var cat in casesByCategories) {
            //console.log("cat "+cat+" value "+casesByCategories[cat]);

            if (url_cat == cat) {
                //console.log("url has cat "+param+" value "+url_params[param]);
                console.log("url has cat " + url_cat);
                // запускаем отображение категории из параметра ссылки  
                urlcat = url_cat;
            }
        }
        if (urlcat != '') {
            return urlcat;
        } else {
            return false;
        }
    }




    function init() {
        casesByCategories = {};
        casesArr.forEach(item => {
            if (item.collection in casesByCategories) {
                casesByCategories[item.collection].push(item);
                //console.table(item);
            } else {
                casesByCategories[item.collection] = [item];
            }
        });

    }



    function getRandomFromAllCategories(count) {

        const categories = Object.keys(casesByCategories);
        let index = 0;
        const items = [];
        while (getTotalSize() > 0) {
            const categorizedItems = casesByCategories[categories[index]];
            index++;
            if (categorizedItems.length > 0) items.push(categorizedItems.shift());
            if (items.length === count) break;
            if (index >= categories.length) index = 0;
        }
        console.warn("render random");
        console.table(items);
        return items;


    }

    function getFromCategory(categoryName, count) {

        if (categoryName in casesByCategories) {
            return casesByCategories[categoryName].splice(0, count);
        }
        console.warn("Category", categoryName, "does not exist!");
        return [];

    }

    function getTotalSize() {
        const categories = Object.keys(casesByCategories);
        let sum = 0;
        categories.forEach(category => (sum += casesByCategories[category].length));
        return sum;
    }

    /*
      function render(items) {
        return items.map(
            item =>
              '<div class="box__item" data-cat="'+item.collection+'">' +
              '<img class="card__img" src="' +
              item.img +
              '"/>' +
              '<p class="name">' +
              item.name +
              "</p>" +
    		  '<p style="color:#999"><strike>249&nbsp;грн</strike><br>' +
              '<p class="price" style="color:#fb515d">199&nbsp;грн</p>' +
              '<p class="art">' +
              item.atr +
              "</p>" +
              '<button class="bay">Выбрать модель</button>' +
              "</div>"
          ).join("");
      }
    */
    function render(items) {
        return items
            // item.img
            .map(
                item =>
                '<div class="box__item" data-cat="' + item.collection + '">' +
                '<div class="img-wrap">' +
                '<img class="card__img" src="' +
                item.img +
                '">' +
                '</div>' +
                '<div class="box-body">' +
                '<p class="name">' +
                item.name +
                "</p>" +
                '<p class="price">' + item.price + ' UAH' + '</p>' +
                '<p class="art">' +
                item.atr +
                "</p>" +
                '<div class="d-flex">' +
                '<div class="current">' +
                '<input type="number" value="1"></input>' +
                '<div class="current__btn">' +
                '<span class="plus"></span>' + '<span class="minus"></span>' +
                '</div>' +
                '</div>' +
                '<button class="btn--buy">В корзину</button>' + '</div>' +
                '</div>' +
                "</div>"
            )
            .join("");
    }

    function hideUsersButton(more) {
        //var next = getTotalSize();
        //var next = more;
        var next = remainedValueButton.innerHTML;
        if (parseInt(next) < 1) {
            if (nextUsersButton.classList) nextUsersButton.classList.add('hide');
            else nextUsersButton.className += ' ' + className;
            nextUsersButton.style.display = 'none';
        } else {
            if (nextUsersButton.classList) nextUsersButton.classList.remove('hide');
            else nextUsersButton.className = nextUsersButton.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            nextUsersButton.style.display = '';
        }
        console.log('more ' + more);
        console.log('remainedValueButton ' + remainedValueButton.innerHTML);

    }





    const nextUsersButton = document.querySelector("#next-users");
    const remainedValueButton = document.querySelector("#remained-value");
    const selectCollection = document.querySelector("#select");
    const usersDiv = document.querySelector("#box");


    a = casesArr.reverse();

    let casesByCategories = {};


    // BEHAVIOUR

    nextUsersButton.addEventListener("click", () => {
        if (selectCollection.value === "all") {
            usersDiv.innerHTML += render(getRandomFromAllCategories(4));
            remainedValueButton.innerHTML = getTotalSize();
        } else {
            usersDiv.innerHTML += render(getFromCategory(selectCollection.value, 4));
            remainedValueButton.innerHTML =
                casesByCategories[selectCollection.value].length;
        }

        hideUsersButton(getTotalSize());

    });

    selectCollection.addEventListener("add2cart2", () => {
        console.log('casesByCategories 1 ' + casesByCategories[selectCollection.value]);
        init();
        usersDiv.innerHTML = render(getFromCategory(selectCollection.value, 4));
        remainedValueButton.innerHTML =
            casesByCategories[selectCollection.value].length;

        hideUsersButton(casesByCategories[selectCollection.value].length);
        console.log('update');


    });


    $('#catalog .select-box').append('<div id="catsel" class="custom-select"><span>Категория все:</span><ul></ul></div>');

    $('head').append('<style>.custom-select span{display:inline-block;cursor:pointer}.custom-select ul li{cursor:pointer}.custom-select ul li:last-child{border-bottom:none}#catalog .select-box #select{position: absolute; top: -55555px; right: -55555px;} .add2cart.btn{background: #393939 !important;} .modal-dialog .btc-group .btn-submit { display: none; } .bline { text-align: center; padding-bottom: 10px;} .bline span { font-size: 13px; } .empty_model {display: none; text-align: center; font-size: 12px; color: red;} @media (max-width: 1024px) { #catsel span {font-size: 14px;} .custom-select { margin: 10px auto 0 auto;} .bline { width: 100%;}} .dop_wrap{display:none}.dop_wrap .dop{background:0 0}.x-cart-overlay .x-title{padding:30px;margin:0}.x-title{margin:0 0 15px;font-size:24px;font-weight:400}.x-shc-item__content{display:table;width:100%;table-layout:fixed}.x-shc-item__image-cell{padding-right:20px;vertical-align:top;text-align:center;font-size:0}.x-shc-item__image{vertical-align:middle;max-height:100px}.x-shc-item__info-cell{display:table-cell;vertical-align:top}.x-shc-item__main-info-cell{display:table-cell;padding-right:20px;vertical-align:top;width:180px}.x-shc-item__info .model_wrap{display:table-cell;width:180px;padding-right:20px;vertical-align:top}.x-shc-item__info .model_wrap{max-width:100%;width:100%}.x-shc-item__title-link{color:#333;text-decoration:none;font-weight:700}.dop,.dop_wrap,.x-shc-item__summary-cell .x-shc-item__cell-label{font-size:12px}.dop_img{width:40px}.x-shc-item__price{margin-right:10px}.x-shc-item__presence{margin:10px 0 0;color:#989898}.x-shc-item__labels-holder{margin:10px 0 0}.x-shc-item__quantity-cell{display:none;width:200px;padding-right:20px;vertical-align:top}.x-quantity__holder{position:relative;overflow:hidden;width:94px;height:40px;padding:0 26px;-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #dfe1f0;border-radius:2px}.x-quantity__button{position:absolute;top:0;bottom:0;background:#f6f8fd;width:26px;font-size:0}.x-quantity__button_type_minus{left:0}.x-quantity__button:before{position:absolute;top:50%;left:50%;height:2px;width:8px;margin:-1px 0 0 -4px;background:#000;content:""}.x-quantity__button_type_plus{right:0}.x-quantity__input{display:block;width:100%;padding:10px 0;border:none;line-height:18px;text-align:center}.x-shc-item__summary-cell{display:table-cell;vertical-align:top}.x-shc-item__control{display:inline-block;vertical-align:middle;color:#989898}.x-shc-item__control-icon{display:inline-block;width:16px;height:16px;vertical-align:middle;fill:currentColor}.x-cart-overlay .x-shc-group{padding:20px 30px 40px}.x-shc-group{background:#fff}.x-shc-total__info-wrapper{width:100%;text-align:right}.x-shc-total__price{display:block;font-size:24px;font-weight:700}.x-button_theme_dark-blue{background:#393939;border-color:#393939;color:#fff}.x-shc-total__button:after{height:48px}.x-button:after{display:inline-block;height:38px;vertical-align:middle;content:""}.x-shc-total__continue-control-holder{display:inline-block;margin-right:30px}.x-button_theme_purple.x-button_type_contour{color:#393939}.x-button_theme_purple{border-color:#393939}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.cart_wrap{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:scroll;outline:0;-webkit-overflow-scrolling:touch}body.modal-open{overflow:hidden}.fade.in{opacity:1}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.cart_wrap.fade .modal-dialog{-webkit-transition:-webkit-transform .3s ease-out;transition:-webkit-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out;transition:transform .3s ease-out,-webkit-transform .3s ease-out,-o-transform .3s ease-out;-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);-o-transform:translate(0,-25%);transform:translate(0,-25%)}.cart_wrap.in .modal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);-o-transform:translate(0,0);transform:translate(0,0)}.form-group{margin-bottom:1rem}@media (max-width:768px){.modal{width:100%;padding:20px 35px}}#order_send_form{margin-top:20px}.delete_product_icon svg{width:15px;height:15px;margin-top:10px;cursor:pointer}.name4print.alert input,.user-name.alert,.user-phone.alert,select#model.alert{border-color:#e6143c}@media (max-width:765px){.x-shc-item__info .model_wrap{display:block;width:100%;padding-right:0;position:relative;top:-10px}.x-shc-item__summary-cell{display:block;vertical-align:middle}.x-shc-total__continue-control-holder{width:100%;display:inline-block;margin-right:0}.x-shc-item{padding-bottom:20px}.name4print{margin-top:5px}.name4print label{font-size:12px;line-height:12px;display:block;padding-bottom:5px}.name4print input{margin-top:8px;display:block;width:100%;height:calc(2.25rem + 2px);padding:.375rem .75rem;font-size:1rem;line-height:1.5;color:#aaa;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:1.45rem;-webkit-transition:border-color .15s;-o-transition:border-color .15s;transition:border-color .15s}.cart_wrap .qa-sc_list-buy_button .x-button__text.send,.cart_wrap.order_form .qa-sc_list-buy_button .x-button__text{display:none}.cart_wrap.order_form .qa-sc_list-buy_button .x-button__text.send{display:inline-block} .x-shc-total form input[type="image"]{position: absolute; top: -88888px; left: -88888px;} .form-check-input{position:absolute!important;z-index:888;opacity:1;margin:10px 0 0 0;width:20px;height:20px;display:block!important;cursor:pointer}</style>');

    var a2cw = $(".modal-dialog .btc-group");
    a2cw.append('<div class="bline empty_model">выберите модель</div><div class="bline"><span class="add2cart btn">Заказать</span></div>');
    a2cw.append('')
    a2cw.append('<div class="bline"><span class="modal_close_b btn">Продолжить покупки</span></div>');

    $("body").on('click', '.modal_close_b', function () {
        removeModal();
    });



    /* Корзина */


    var cart_products = [];

    $(document).ready(function () {
        init_cart();

    });
    var cart_item_tpl = '';
    var order_send_form = '';
    var Articl = '';
    var Articl1 = '';
    var Articl2 = '';
    var Articl3 = '';
    var Articl4 = '';
    var Articl5 = '';
    var Articl6 = '';
    var Articl7 = '';
    var Articl8 = '';
    var Articl9 = '';

    function init_cart() { // инициализация корзины
        $('div.modal').addClass('hidden').show();

        //console.log('model_select '+model_select);
        var minicart_icon = '<div id="shop-cart-btn" class="white circle"> <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.8542 6.125C34.7084 5.97919 34.5625 5.83331 34.2709 5.83331H6.5625L5.83331 2.04168C5.83331 1.75 5.39581 1.45837 5.10412 1.45837H0.729121C0.291689 1.45831 0 1.75 0 2.1875C0 2.625 0.291689 2.91668 0.729189 2.91668H4.52088L8.02088 20.7084C8.45838 23.0417 10.6459 24.7917 12.9792 24.7917H29.75C30.1875 24.7917 30.4792 24.5 30.4792 24.0625C30.4792 23.625 30.1875 23.3333 29.75 23.3333H13.125C11.9583 23.3333 10.7917 22.75 10.2083 21.7291L31.5 18.8125C31.7917 18.8125 32.0833 18.5208 32.0833 18.2292L35 6.5625C35 6.5625 35 6.27081 34.8542 6.125ZM30.7708 17.5L9.47912 20.2708L6.85412 7.14581H33.25L30.7708 17.5Z" fill="white"/><path d="M12.3958 26.25C10.3542 26.25 8.75 27.8542 8.75 29.8958C8.75 31.9375 10.3542 33.5416 12.3958 33.5416C14.4375 33.5416 16.0416 31.9374 16.0416 29.8958C16.0417 27.8542 14.4375 26.25 12.3958 26.25ZM12.3958 32.0833C11.2291 32.0833 10.2083 31.0624 10.2083 29.8958C10.2083 28.7292 11.2291 27.7083 12.3958 27.7083C13.5625 27.7083 14.5833 28.7292 14.5833 29.8958C14.5833 31.0624 13.5625 32.0833 12.3958 32.0833Z" fill="white"/><path d="M26.9792 26.25C24.9375 26.25 23.3334 27.8542 23.3334 29.8958C23.3334 31.9375 24.9376 33.5416 26.9792 33.5416C29.0209 33.5416 30.625 31.9374 30.625 29.8958C30.625 27.8542 29.0208 26.25 26.9792 26.25ZM26.9792 32.0833C25.8125 32.0833 24.7917 31.0624 24.7917 29.8958C24.7917 28.7292 25.8125 27.7083 26.9792 27.7083C28.1459 27.7083 29.1667 28.7292 29.1667 29.8958C29.1667 31.0624 28.1458 32.0833 26.9792 32.0833Z" fill="white"/></svg><div id="shopCartAmount">0</div></div>';
        $("body").append(minicart_icon); // добавление иконки миникорзины на страницу
        cartFromcookie();
        var cart_styles = '<style>#shop-cart-btn{color:#fff;cursor:pointer;display:none;fill:#fff;font-size:13px;height:70px;opacity:.9;position:fixed;right:25px;text-align:center;top:90px;width:70px;z-index:998}#shop-cart-btn.white{background-color:#759ff6;border:1px solid #e4eaec;color:#555;fill:#555}#shop-cart-btn.circle{border-radius:50%}#shop-cart-btn .cart-ico{height:40px;left:50%;fill:white;margin:-20px 0 0 -20px;position:absolute;top:50%;width:40px}#shop-cart-btn #shopCartAmount{    font-size: 14px; line-height: 10px; background-color:white;border-radius:50%;top:10px;font-weight:700;right:5px;height:20px;padding:5px;position:absolute;color:#759ff6;width:20px}  </style>';
        $("body").append(cart_styles); // добавлние css UI корзины и связных UI в DOM
        cart_item_tpl = ('<div class="x-shc-item" data-qaid="product_item"><div class="x-shc-item__image-cell"><img class="x-shc-item__image" src=""></div><div class="x-shc-item__title-holder">sneakers </div><div class="x-shc-item__price-holder"><span class="x-shc-item__price articul"></span></div><div class="price-name"><div class="x-shc-item__title-holder">sneakers </div><div class="x-shc-item__price-holder"><span class="x-shc-item__price articul"></span></div></div><div class="current-wrap"><span class="descr descr--inline">Количество</span><div class="cart_current"><input type="number" value="1"><div class="cart_current__btn"><span class="plus"></span><span class="minus"></span></div></div>шт.</div><div class="x-shc-item__summary-cell"><div class="x-shc-item__cell-label"></div><div><span class="descr descr--inline">Цена:</span><div class="x-shc-item__summary-price" data-qaid="product_price"></div></div></div><div class="x-shc-item__control-cell"><div><span class="x-shc-item__control delete_product_icon" data-qaid="delete_product_icon"><svg viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="11" x2="11" y2="1"  stroke-width="2" /><line x1="1" y1="1" x2="11" y2="11"  stroke-width="2" /></svg></span><span class="descr descr--inline">Удалить</span></div></div></div>'); // шаблон позиции в корзине 
        order_send_form = '<div id="order_send_form"><div class="form-group"><label for="">Имя*:</label><input type="text" class="form-control user-name" placeholder="Имя" title="Напишите имя в указанном формате (Иван Петров)" required=""></div><div class="form-group"><label for="">Телефон*:</label><input type="tel" class="form-control user-phone" minlength="13" maxlength="13" placeholder="Телефон" title="Формат: +380975555555" required=""></div></div><div class="dop-info"><div class="delivery"><div class="form-row bd-example"><div class="col-12"><p>Варианты доставки:</p></div><div class="col-6"><div class="form-check form-check-inline"><input class="form-check-input user-post" type="radio" name="delivery-post" id="new-post-checkbox" value="Новая Почта" checked=""><label class="form-check-label" id="new-post-label" for="new-post-checkbox">Новая почта</label></div></div><div class="col-6"><div class="form-check form-check-inline"><input class="form-check-input user-post" type="radio" id="ukr-post-check" name="delivery-post" value="Укр Почта"><label class="form-check-label" id="ukr-post-label" for="ukr-post-check">УкрПочта</label></div></div></div><div class="bd-example" id="new-post"><div class="form-group form-row"><div class="col-12 mb-2"><input class="form-control user-surname" type="text" placeholder="Фамилия"></div></div><div class="form-group form-row"><div class="col-6 mb-2"><input class="form-control city" type="text" placeholder="Город"></div><div class="col-6 mb-2"><input class="form-control branch_number" type="text" placeholder="Номер отделения"></div></div><div class="form-group form-row"><div class="col-6 mb-2"> <select class="form-control" id="type-post"><option value="">Тип доставки:</option><option value="До отделения">До отделения</option><option value="Курьерская доставка">Курьерская доставка</option> </select></div><div class="col-6 mb-2"> <select class="form-control" id="payment"><option value="">Тип оплаты:</option><option value="Наложенный платёж">Наложенный платёж</option><option value="Оплата на карту">Оплата на карту</option> </select></div></div></div><div class="bd-example" id="ukr-post"><div class="form-group form-row"><div class="col-12 mb-2"><input class="form-control user-surname-ukr" type="text" placeholder="Фамилия"></div></div><div class="form-group form-row"><div class="col-6 mb-2"><input class="form-control region" type="text" placeholder="Область"></div><div class="col-6 mb-2"><input class="form-control user-area" type="text" placeholder="Район"></div></div><div class="form-group form-row"><div class="col-6 mb-2"><input class="form-control city-ukr" type="text" placeholder="Город"></div><div class="col-6 mb-2"><input class="form-control branch_number-ukr" type="text" placeholder="Номер отделения"></div></div><div class="form-group form-row"><div class="col-6 mb-2"><input class="form-control city-index" type="text" minlength="3" inputmode="numeric" placeholder="Индекс"></div><div class="col-6 mb-2"> <select class="form-control" id="payment-urk"><option value="">Тип оплаты:</option><option value="Наложенный платёж">Наложенный платёж</option><option value="Оплата на карту">Оплата на карту</option> </select></div></div></div></div></div><div class="bd-example additional"><div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="click" name="click" value="3"><label class="form-check-label additional-link action-elem" for="click" style="border:none;background:transparent;font-weight:bold;color:#793896;cursor:pointer;text-align:left">Добавить дополнительную информацию к заказу</label></div></div>';
    }

    function checkPrintName() {
        $('.x-shc-item').each(function () {
            var namei = $(this).find('.name4print input');
            if (namei.length > 0) {
                console.log('name4print input');
                var name = namei.val();
                if (name == '' || name.length > 19) {
                    $(this).find('.name4print').addClass("alert");
                    // return false;
                } else {
                    $(this).find('.name4print').removeClass("alert");
                    var i = $(this).index();
                    console.log('index  ' + i);
                    cart_products[i]['pname'] = name;
                    return true;
                }
            }
        });
        return true;
    }

    function open_cart_modal() { // открытие модального окна корзины
        $("body").toggleClass("modal-open");
        $(".cart_wrap").toggleClass("fade in").show();
        $(".cart_wrap .modal-backdrop").show();
        var card_lenght = cart_products.length;
        if (card_lenght >= 1) {
            $(".qa-sc_list-buy_button").prop('disabled', false);
        } else {
            $(".qa-sc_list-buy_button").prop('disabled', true);
        }
        if (card_lenght == 1) {
            $('.x-description').text(card_lenght + " товар");
        } else if (card_lenght >= 5 || card_lenght == 0) {
            $('.x-description').text(card_lenght + " товаров");
        } else {
            $('.x-description').text(card_lenght + " товарa");
        }
    }

    function removeCModal() { // закрытие модального окна корзины
        $("body").removeClass("modal-open");
        $(".cart_wrap").removeClass("fade in").removeClass("order_form").hide();
        $(".cart_wrap .modal-backdrop").hide();
        /*   
          checkPrintName();
          cart2cookie();
        */
        var names = checkPrintName();
        if (names) {
            cart2cookie();
        }

    }

    $("body").on('click', '.cart_wrap .modal-close, .cart_wrap .x-shc-total__button_type_continue, .modal-backdrop', function () { // события с закрытием модального окна корзины
        removeCModal();
    });
    $("body").on('click', '.delete-basket-all', function () {
        cart_products = [];
        cart_update2();
    })
    $("body").on('click', '.add2cart', function () { // событие добаление товарв в корзину
        add2cart();
    });
    $("body").on('click', '#shop-cart-btn', function () { // событие отображения корзины
        show_cart2();
    });
    $("body").on("click", "#del", function () {
        $(".bay-art").text("");
    });

    $("body").on("click", ".additional-link", function () {

        const hBlock = document.querySelector(".dop-info");
        const addButton = document.querySelector(".additional-link");
        const additional = hBlock.textContent;
        $(".dop-info").toggle("slow");
        if (addButton.textContent === "Скрыть дополнительную информацию к заказу") {
            addButton.textContent = "Не перезванивайте мне, я уверен в заказе";
            $("#new-post .form-control").prop("required", false);
            $("#ukr-post .form-control").prop("required", false);
            $(addButton).prop("checked", true);
        } else {
            addButton.textContent = "Скрыть дополнительную информацию к заказу";
            $("#new-post .form-control").prop("required", true);
            $(addButton).prop("checked", false);
        }
    });

    $("#box").on("click", ".btn--buy", function (e) {
        e.preventDefault();
        var t = e.target;
        var btn = $(".bay");
        var result = $(this).closest(".box__item");
        var name = result.find(".name").text();
        var articul = result.find(".art").text();
        var price = parseFloat(result.find(".price").text());
        console.log(price);
        var img = $(".card__img").attr("src");
        var cat = result.attr("data-cat");
        var current = parseFloat(result.find(".current input").val());
        add2cart2(name, articul, price, img, cat, current);
        console.log(cart_products);
        return false;
    });


    $("body").on("click", ".cart_wrap .delete_product_icon", function () {
        var index = $(this).closest(".x-shc-item").index();
        cart_product_delete(index);
    });
    $("body").on("click", ".cart_current__btn .plus", function () {
        var cart_current = $(this).parent().parent().find("input").val();
        var index = $(this).closest(".x-shc-item").index();
        cart_products[index]['current'] = parseInt(cart_current, 10) + 1;
        cart_update2();
    });

    $("body").on("click", ".cart_current__btn .minus", function () {
        var cart_current = $(this).parent().parent().find("input").val();
        var index = $(this).closest(".x-shc-item").index();
        if (cart_current !== "1") {
            cart_products[index]['current'] = parseInt(cart_current, 10) - 1;
            cart_update2();
        }
    });
    $('body').on("change", ".cart_wrap .model_wrap #model", function () {
        var item = $(this).closest(".x-shc-item");
        var index = $(this).closest(".x-shc-item").index();
        var model = $(this).val();
        cart_products[index]['model'] = model;
        item.find('.x-shc-item__price.model').text(model);
        $(this).removeClass("alert");
        cart2cookie();
    });

    $('body').on("keyup", ".cart_wrap .user-phone", function () {
        var v = $(this).val();
        if (v.indexOf('+380') < 0) {
            var fs = v.slice(0, 1);
            //  console.log('user phone fs - '+fs);
            if (fs == '0') {
                var nv = '+38' + v;
            } else {
                var nv = '+380' + v;
            }
            $(this).val(nv);

        }

    });

    $("body").on("click", ".cart_wrap #new-post-checkbox", function () {
        $(".cart_wrap #new-post").show("slow");
        $(".cart_wrap #ukr-post").hide("slow");
        $(".cart_wrap #new-post .form-control").prop("required", true);
        $(".cart_wrap #ukr-post .form-control").prop("required", false);
    });
    $("body").on("click", ".cart_wrap #ukr-post-check", function () {
        $(".cart_wrap #ukr-post").show("slow");
        $(".cart_wrap #new-post").hide("slow");
        $(".cart_wrap #new-post .form-control").prop("required", false);
        $(".cart_wrap #ukr-post .form-control").prop("required", true);
    });



    $("body").on("click", ".cart_wrap .qa-sc_list-buy_button", function () {
        var order_ready = 1;
        var names = checkPrintName();
        if (!names) {
            order_ready = 0;
            return false;
        }


        if (order_ready == 1) {
            cart2cookie();
            if ($(".cart_items #order_send_form").length < 1) {
                $(".cart_items").append(order_send_form);
                $(".cart_wrap").addClass('order_form');
                return false;
            }
            if (!$(".cart_wrap").hasClass('order_form')) {
                $(".cart_wrap").addClass('order_form');
                //$('.cart_wrap .qa-sc_list-buy_button')
            } else {
                var name = $(".cart_wrap.order_form .user-name").val();
                if (name == '' || !name) {
                    //alert('Укажите ваше имя');
                    $(".cart_wrap.order_form .user-name").addClass("alert");
                    return false;
                } else {
                    $(".cart_wrap.order_form .user-name").removeClass("alert");
                }
                var phone = $(".cart_wrap.order_form .user-phone").val();
                if (phone == '' || !phone) {
                    $(".cart_wrap.order_form .user-phone").addClass("alert");
                    //alert('Укажите ваш номер телефона');
                    return false;
                } else {
                    $(".cart_wrap.order_form .user-phone").removeClass("alert");
                }
                console.log('user-name ' + $(".cart_wrap .user-name").val());
                console.log('user-phone ' + $(".cart_wrap .user-phone").val());
                console.log('send order');
                var products = make_order_data();
                var domen = getdomen();
                if ($(".cart_wrap input[name='delivery-post']:checked").val() == "Новая Почта") {
                    var city = $(".cart_wrap .city").val();
                    var surname = $(".cart_wrap .user-surname").val();
                    var branchNumber = $(".cart_wrap .branch_number").val();
                    customRegion = " - ";
                    areaUk = " - ";
                    cityIndex = " - ";
                    paymentN = payment;
                } else {
                    var city = $(".cart_wrap .city-ukr").val();
                    var surname = $(".cart_wrap .user-surname-ukr").val();
                    var branchNumber = $(".cart_wrap .branch_number-ukr").val();
                    customRegion = $(".cart_wrap .region").val();
                    areaUk = $(".cart_wrap .user-area").val();
                    cityIndex = $(".cart_wrap .city-index").val();
                    paymentN = paymentUkr;
                    typePost = " - ";
                }

                //for (var product in cart_products) {}

                if (cart_products[0]['articul'] && cart_products[0]['articul'] != '' && cart_products[0]['articul'] != undefined) {
                    Articl = cart_products[0]['articul'];
                }

                if (cart_products[1] && cart_products[1]['articul'] != '' && cart_products[1]['articul'] != undefined) {
                    Articl1 = cart_products[1]['articul'];
                }


                if (cart_products[2] && cart_products[2]['articul'] != '' && cart_products[2]['articul'] != undefined) {
                    Articl2 = cart_products[2]['articul'];
                }

                if (cart_products[3] && cart_products[3]['articul'] != '' && cart_products[3]['articul'] != undefined) {
                    Articl3 = cart_products[3]['articul'];
                }

                if (cart_products[4] && cart_products[4]['articul'] != '' && cart_products[4]['articul'] != undefined) {
                    Articl4 = cart_products[4]['articul'];
                }

                if (cart_products[5] && cart_products[5]['articul'] != '' && cart_products[5]['articul'] != undefined) {
                    Articl5 = cart_products[5]['articul'];
                }

                if (cart_products[6] && cart_products[6]['articul'] != '' && cart_products[6]['articul'] != undefined) {
                    Articl6 = cart_products[6]['articul'];
                }

                if (cart_products[7] && cart_products[7]['articul'] != '' && cart_products[7]['articul'] != undefined) {
                    Articl7 = cart_products[7]['articul'];
                }

                if (cart_products[8] && cart_products[8]['articul'] != '' && cart_products[8]['articul'] != undefined) {
                    Articl8 = cart_products[8]['articul'];
                }

                if (cart_products[9] && cart_products[9]['articul'] != '' && cart_products[9]['articul'] != undefined) {
                    Articl9 = cart_products[9]['articul'];
                }
                /* */
                /* */
                _rc("send", "order", {
                    name: name,
                    phone: phone,
                    orderMethod: "landing-page",
                    customArticl: Articl,
                    customArticl1: Articl1,
                    customArticl2: Articl2,
                    customArticl3: Articl3,
                    customArticl4: Articl4,
                    customArticl5: Articl5,
                    customArticl6: Articl6,
                    customArticl7: Articl7,
                    customArticl8: Articl8,
                    customArticl9: Articl9,
                    customRegion: customRegion,
                    customArea: areaUk,
                    customerComment: products,
                    customModel: '',
                    customDelivery: $(".cart_wrap input[name='delivery-post']:checked").val(),
                    customTypepost: typePost,
                    customSurname: surname,
                    customCity: city,
                    customBranchNumber: branchNumber,
                    customType: paymentN,
                    customUserIndex: cityIndex,
                    callback: function (success, response) {
                        if (success) {

                            var domen = getdomen();
                            Cookies.set('' + domen + '_order', response.id);
                            clearCartCookie();
                            window.location.href = domen + "thank.php";

                        } else {
                            alert("К сожалению, не удалось отправить заявку.");
                        }
                    }
                });



                return false;
            }
        }
    });



    function clear_cart() {
        $(".cart_items").html('');
        $(".cart_wrap").removeClass('order_form');
    }

    var order_sum = 0;

    function make_order_data() {
        var products = '';
        var order_total = 0;
        for (var product in cart_products) {
            var name = cart_products[product]['name'];
            var image = cart_products[product]['image'];
            var model = cart_products[product]['model'];
            var articul = cart_products[product]['articul'];
            var current = cart_products[product]['current'];
            var price = cart_products[product]['price'];
            var psum = price;
            order_total = order_total + parseFloat(psum) * current;
            var num = parseInt(product) + 1;
            var pname = '';
            if (cart_products[product]['pname'] != '' && cart_products[product]['pname'] != undefined) {
                pname = 'Имя для печати: ' + cart_products[product]['pname'] + '';
            }
            products = products + '[' + num + '. Артикул: ' + articul + ' Модель: ' + model + ' ' + pname + ' Цена: ' + price + ' ] <br/>';
        }
        products = products + ' Итого: ' + order_total + '';
        order_sum = order_total;
        console.log('Данные заказа: ' + products);
        return products;
    }


    function show_cart() { // отображение корзины
        open_cart_modal();
        $('.cart_wrap .cart_items').html('');
        var order_total = 0;
        for (var product in cart_products) {
            var name = cart_products[product]['name'];
            var image = cart_products[product]['image'];
            var model = cart_products[product]['model'];
            var articul = cart_products[product]['articul'];
            var dop = cart_products[product]['dop'];
            var dop_img = cart_products[product]['dop_img'];
            var price = cart_products[product]['price'];
            var current = cart_products[product]['current'];
            var psum = price;
            if (dop.length > 0) {
                psum = psum + cart_products[product]['priced'];
            }
            $('.cart_wrap .cart_items').append(cart_item_tpl);
            var li = $('.cart_wrap .cart_items .x-shc-item:last');
            li.find('.x-shc-item__title-holder').html(name);
            li.find('.x-shc-item__image').attr('src', image);
            li.find('.model').html(model);
            li.find('.articul').html(articul);
            if (dop.length > 0) {
                li.find('.dop_wrap').show();
                li.find('.dop').html(dop);
            }
            if (dop_img.length > 0) {
                li.find('.dop_img').attr('src', dop_img);
            }
            li.find('.x-shc-item__summary-price').html(psum);
            li.find('.cart_current input').val(current);
            order_total = order_total + parseFloat(psum) * current;
        }
        $('.cart_wrap .x-shc-total__info-wrapper .x-shc-total__price').html(order_total + ' грн.');

        // offer_modal_update();
    }

    var disc1 = 25; // % скидки на товары после добавления 1-го товара в корзину
    var disc2 = 37; // % скидки на товары после добавления 1-го товара в корзину
    var pprice1 = 349;
    var pprice2 = 299;
    var pprice3 = 249;
    var ppriced = 75;
    var prod2 = 'Купить второй чехол за 299 грн';
    var prod3 = 'Купить еще чехол за 249 грн';

    function cart_product_delete(index) {
        cart_products.splice(index, 1);
        cart_update2();
    }


    function cart_update() { // обработка события добавления товара в корзину 
        var cpid = cart_products.length;
        $("#shopCartAmount").html(cpid);
        if (cpid > 0) {
            $('#shop-cart-btn').show();
        } else {
            $('#shop-cart-btn').hide();
        }
        $("body").removeClass("modal-open");
        $(".modal").removeClass("fade in");

        show_cart();
    }



    function add2cart() { // добавление товара в корзину и обновление данных товара если он уже есть в корзине
        var p = {};
        var cpid = cart_products.length;
        var update = 0;

        if (p['model'].length < 1) {
            p['price'] = $("#feedback-form .bd-example .price").text();
            $('.empty_model').show();
        } else {
            $('.empty_model').hide();
            p['articul'] = $("#feedback-form .case-art").text();
            p['dop'] = $("#feedback-form .bay-art").text();
            p['dop_img'] = $("#feedback-form .bay-img").attr('src');
            p['quant'] = 1;
            p['name'] = $("#feedback-form .modal-name").text();
            p['image'] = $("#feedback-form .modal-img").attr('src');





            console.table(cart_products);
            cart_update();
        }
    }


    function add2cart2(name, articul, price, img, cat, current) { // добавление товара в корзину без модального окна
        var p = {};
        var cpid = cart_products.length;
        var update = 0;
        //	console.log('cpid '+cpid);
        p['articul'] = articul;
        p['quant'] = 1;
        p['name'] = name;
        p['image'] = img;
        p['cat'] = cat;
        p['model'] = cat;
        p['current'] = current;
        p['price'] = price;
        if (cpid > 0) {
            for (var product in cart_products) {

                if (cart_products[product]['articul'] == p['articul']) {
                    cart_products[product]['current'] = cart_products[product]['current'] + current;
                    update = 1;
                }
            }
        }
        if (update == 0) {
            cart_products[cpid] = p;
        }
        var shopCartAmount = cart_products.length;
        $("#shopCartAmount").html(shopCartAmount);

        console.table(cart_products);
        cart_update2();

    }

    function cart_widget() {
        var cpid = parseInt(cart_products.length);
        $("#shopCartAmount").html(cpid);
        if (cpid > 0) {
            $('#shop-cart-btn').show();
            console.log('cart_widget ' + cpid);
        } else {
            $('#shop-cart-btn').hide();
        }

    }

    function cart_update2() { // обработка события добавления товара в корзину без модального окна
        cart_widget();
        $("body").removeClass("modal-open");
        $(".modal").removeClass("fade in");

        show_cart2();
    }
    $("body").on("click", ".plus", function (e) {
        var $input = $(this)
            .parent()
            .parent()
            .find("input");
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        // cart_update2();
        return false;
    });
    $("body").on("click", ".minus", function (e) {
        var $input = $(this)
            .parent()
            .parent()
            .find("input");
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        // cart_update2();
        return false;
    });

    // function show_cart2() { // отображение корзины без модального окна
    //     console.log('show_cart2');
    //     console.table(cart_products);
    //     open_cart_modal();
    //     // offer_modal_update();
    //     $('.cart_wrap .cart_items').html('');
    //     var order_total = 0;
    //     for (var product in cart_products) {
    //         console.log('product -' + product);

    //         var name = cart_products[product]['name'];
    //         var image = cart_products[product]['image'];
    //         var model = cart_products[product]['model'];
    //         var articul = cart_products[product]['articul'];
    //         var current = cart_products[product]['current'];
    //         //var dop = cart_products[product]['dop'];
    //         //var dop_img = cart_products[product]['dop_img'];
    //         var price = cart_products[product]['price'];
    //         var psum = price + " грн";
    //         $('.cart_wrap .cart_items').append(cart_item_tpl);
    //         //console.log('append product tpl');
    //         var li = $('.cart_wrap .cart_items .x-shc-item:last');
    //         li.find('.x-shc-item__title-holder').html(name);
    //         li.find('.x-shc-item__image').attr('src', image);
    //         li.find('.current input').val(current);
    //         li.find('.x-shc-item__price.model').html(model);
    //         //if (cart_products[product]['cat'] == 'name'){
    //         if (cart_products[product]['name'].indexOf('именной') > -1) {
    //             var pname = '';
    //             if (cart_products[product]['pname'] != '' && cart_products[product]['pname'] != undefined) {
    //                 pname = cart_products[product]['pname'];
    //             }
    //             li.find('.model_wrap').append("<div class='name4print'><input value='" + pname + "' placeholder='Имя для печати'></div>");
    //         }

    //         li.find('.articul').html(articul);
    //         li.find('.x-shc-item__summary-price').html(psum);
    //         order_total = order_total + parseFloat(psum) * current;
    //     }
    //     $('.cart_wrap .x-shc-total__info-wrapper .x-shc-total__price').html(order_total + ' грн.');

    // }
    function show_cart2() { // отображение корзины без модального окна
        console.log('show_cart2');
        console.table(cart_products);
        open_cart_modal();
        // offer_modal_update();
        $('.cart_wrap .cart_items').html('');
        var order_total = 0;
        for (var product in cart_products) {
            console.log('product -' + product);

            var name = cart_products[product]['name'];
            var image = cart_products[product]['image'];
            var model = cart_products[product]['model'];
            var articul = cart_products[product]['articul'];
            var current = cart_products[product]['current'];
            //var dop = cart_products[product]['dop'];
            //var dop_img = cart_products[product]['dop_img'];
            var price = cart_products[product]['price'];
            var psum = price + " грн";
            $('.cart_wrap .cart_items').append(cart_item_tpl);
            //console.log('append product tpl');
            var li = $('.cart_wrap .cart_items .x-shc-item:last');
            li.find('.x-shc-item__title-holder').html(name);
            li.find('.x-shc-item__image').attr('src', image);
            li.find('.cart_current input').val(current);
            li.find('.x-shc-item__price.model').html(model);
            //if (cart_products[product]['cat'] == 'name'){
            if (cart_products[product]['name'].indexOf('именной') > -1) {
                var pname = '';
                if (cart_products[product]['pname'] != '' && cart_products[product]['pname'] != undefined) {
                    pname = cart_products[product]['pname'];
                }
                li.find('.model_wrap').append("<div class='name4print'><input value='" + pname + "' placeholder='Имя для печати'></div>");
            }

            li.find('.articul').html(articul);
            li.find('.x-shc-item__summary-price').html(psum);
            order_total = order_total + parseFloat(psum) * current;
        }
        $('.cart_wrap .x-shc-total__info-wrapper .x-shc-total__price').html(order_total + ' грн.');

    }

    function getdomen() {
        var href = document.location.href;
        if (href.indexOf('index.php') > -1) {
            var domen = href.split('index.php')[0];
        } else {
            var domen = href;
        }
        console.log('domen - ' + domen);
        return domen;
    }

    function cartFromcookie() {
        var domen = getdomen();
        if (Cookies.get('' + domen + '')) {
            cart_products = JSON.parse(Cookies.get('' + domen + ''));
        }
        if (cart_products.length > 0) {
            $(window).on('load', function () {
                cart_widget();
            });
            console.log('cart in cookie - ' + cart_products);
            console.table(cart_products);
        }
    }

    function cart2cookie() {
        for (var product in cart_products) {
            //console.log('product -'+product);
            var name = cart_products[product]['name'];
            var image = cart_products[product]['image'];
            var model = cart_products[product]['model'];
            var articul = cart_products[product]['articul'];
            var price = cart_products[product]['price'];
        }
        var domen = getdomen();
        Cookies.set('' + domen + '', cart_products);
    }

    function clearCartCookie() {
        var domen = getdomen();
        Cookies.set('' + domen + '', '');
    }

    /* END Корзина */


    var html = [];
    var catselt1 = '';
    var disabled = 0;
    $('#select option').each(function (i) {
        if ($(this).attr('disabled') !== undefined) {
            disabled = 1;
        }
    });
    $('#select option').each(function (i) {
        var dis = '';
        if ($(this).attr('disabled') !== undefined) {
            //dis = 'style="display: none;"';
            dis = 'class="all"';
            catselt1 = $(this).text();
        }
        var lit = '';
        if (dis == '') {
            lit = $(this).text()
        } else {
            lit = 'Новинки';
        }

        html.push('<li ' + dis + ' rel="' + $(this).val() + '">' + lit + '</li>');
        stripSelectText();
    });


    $('#catsel ul').html(html.join(''))


    var $lists = $('#catsel');

    function stripSelectText() {
        var tb = $(".custom-select span:eq(0)");
        var t = tb.text();
        var tl = parseInt(t.length);
        if (tl > 25) {
            var ft = t.substr(0, 22);
            var nt = ft + '...';
            tb.html(nt);
        }
        console.log('select text length ' + tl);
    }

    $lists.on('click', function (e) {
        e.stopPropagation();
        $lists.not(this).find('ul:visible').hide()
        var $tgt = $(e.target);
        $(this).find('ul').slideToggle('fast');
        if ($tgt.is('li')) {
            var optv = $tgt.html();
            var td = ':';
            //	console.log('catselt1 - '+catselt1);
            if (catselt1.indexOf(':') > -1) {
                td = '';
            }
            if (href.indexOf('games') > -1) {
                lit = 'catselt1 ';
            }
            //var optvf = '<span class="catseln">'+catselt1+'</span>'+td+' <span class="catselv">'+optv+'</span>';
            var optvf = '<span class="catseln"></span><span class="catselv">' + optv + '</span>';
            $(this).find('span').html(optvf);
            var value = $tgt.attr('rel');
            $('#select').val(value);
            stripSelectText();

            if (selectCollection.value == 'all') {
                init();

                usersDiv.innerHTML = render(getRandomFromAllCategories(8));
                remainedValueButton.innerHTML = getTotalSize();
                hideUsersButton(getTotalSize());


                console.warn("getFromCategory all");
            } else {
                init();
                //	console.table('casesByCategories '+casesByCategories[selectCollection.value]);
                usersDiv.innerHTML = render(getFromCategory(selectCollection.value, 4));
                remainedValueButton.innerHTML =
                    casesByCategories[selectCollection.value].length;
                hideUsersButton(casesByCategories[selectCollection.value].length);
            }


            console.log('update');

        }


    })

    $(document).click(function (e) {
        $lists.find('ul:visible').hide();
    });

    init();

    var cat_from_url = urlcat();
    if (cat_from_url) {
        $("#catsel ul li").each(function () {
            var so = $(this).attr("rel");
            // console.warn("so "+so);	
            if (so == cat_from_url) {
                console.warn("catsel has url cat");
                $(this).click();
                $("#catsel ul").hide();
            }
        });


        console.warn("render from url");
    } else {
        window.all_list_random = render(getRandomFromAllCategories(4)); //all category
        // window.all_list_random = render(getFromCategory("iPhoneX", 4));
        usersDiv.innerHTML += window.all_list_random;
        window.all_list_random_size = getTotalSize();
        remainedValueButton.innerHTML = window.all_list_random_size;

    }

    console.log('ready');


});