/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/js/view/Utils.js
// UI Utils

/**
 * @param selector  {string}
 * @return {HTMLElement | null}
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * @param selector  {string}
 * @return {NodeListOf<HTMLElement>}
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * @param div   {HTMLElement}
 * @param visible {boolean | 'none' | 'block' | 'flex' | 'inline-block'}
 */
function toggle(div, visible) {
    let d = visible;
    if (visible === true) d = 'block';
    if (visible === false) d = 'none';

    div.style.display = d;
}

/**
 * @param div   {HTMLElement}
 * @param isVisible {boolean}
 * @param params?    {{isBack?: boolean}}
 */
function toggleFaded(div, isVisible, params) {
    params = params || {};
    if (params.isBack) {
        div.classList.add('isBack');
    } else {
        div.classList.remove('isBack');
    }
    if (isVisible) {
        div.classList.add('faded-show');
        div.classList.remove('faded-hide');
    } else {
        div.classList.remove('faded-show');
        div.classList.add('faded-hide');
    }
}

/**
 * @param div   {HTMLElement}
 * @param className {string}
 * @param duration  {number}
 */
function triggerClass(div, className, duration) {
    div.classList.add(className);

    setTimeout(() => {
        div.classList.remove(className);
    }, duration);
}

/**
 * @param params    {{tag: string, clazz?: string | (string | undefined)[], text?: string, child?: (HTMLElement | undefined)[], style?: Object<string, string>}}
 * @return {HTMLElement}
 */
function createElement(params) {
    const item = document.createElement(params.tag);
    if (params.clazz) {
        if (Array.isArray(params.clazz)) {
            for (let c of params.clazz) {
                if (c) {
                    item.classList.add(c);
                }
            }
        } else {
            item.classList.add(params.clazz);
        }
    }
    if (params.text) item.innerText = params.text;
    if (params.child) {
        for (let c of params.child) {
            if (c) {
                item.appendChild(c);
            }
        }
    }
    if (params.style) {
        for (let key in params.style) {
            item.style[key] = params.style[key];
        }
    }
    return item;
}

/**
 * @param el {HTMLElement}
 * @param s  {string}
 * @return {HTMLElement}
 */
function setAddr(el, s) {
    el.innerHTML = '';
    el.appendChild(document.createTextNode(s.substring(0, s.length / 2)));
    el.appendChild(document.createElement('wbr'));
    el.appendChild(document.createTextNode(s.substring(s.length / 2)));
    return el;
}

/**
 * @param el    {HTMLElement}
 */
function clearElement(el) {
    el.innerHTML = '';
}

/**
 * @param input {HTMLElement}
 * @param handler   {(e: Event) => void}
 */
function onInput(input, handler) {
    input.addEventListener('change', handler);
    input.addEventListener('input', handler);
    input.addEventListener('cut', handler);
    input.addEventListener('paste', handler);
}

/**
 * @param n {number}
 * @return {string}
 */
function doubleZero(n) {
    if (n < 10) return '0' + n;
    return n.toString();
}

/**
 * @param date  {Date}
 * @return {string}
 */
function formatTime(date) {
    return doubleZero(date.getHours()) + ':' + doubleZero(date.getMinutes());
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * @param date  {Date}
 * @return {string}
 */
function formatDate(date) {
    return MONTH_NAMES[date.getMonth()] + ' ' + date.getDate();
}

/**
 * @param date  {Date}
 * @return {string}
 */
function formatDateFull(date) {
    return date.toString();
}

/**
 * @param text  {string}
 * @return {boolean}
 */
function copyToClipboard(text) {
    /** @type {HTMLTextAreaElement} */
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    /** @type {boolean} */
    let result = false;
    try {
        result = document.execCommand('copy');
    } catch (err) {
    }

    document.body.removeChild(textArea);
    return result;
}

const IMPORT_WORDS_COUNT = 24;
const CONFIRM_WORDS_COUNT = 3;



;// CONCATENATED MODULE: ./src/js/view/Lottie.js


/**
 * @type {Object<string, any>} lottie name -> lottie element
 */
const lotties = {};

/**
 * @param div   {HTMLElement}
 * @return {Promise<void>}
 */
function initLottie(div) {
    return new Promise((resolve, reject) => {
        const url = div.getAttribute('src');
        const name = div.getAttribute('data-name');
        const w = Number(div.getAttribute('width'));
        const h = Number(div.getAttribute('height'));

        const xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = 'arraybuffer';
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    const canvas = document.createElement('canvas');
                    canvas.setAttribute('width', w * window.devicePixelRatio);
                    canvas.setAttribute('height', h * window.devicePixelRatio);
                    canvas.style.width = w + 'px';
                    canvas.style.height = h + 'px';
                    div.appendChild(canvas);
                    const ctx = canvas.getContext('2d');

                    const animationData = JSON.parse(new TextDecoder('utf-8').decode(pako.inflate(xmlHttp.response)));
                    lotties[name] = {
                        ctx: ctx,
                        player: lottie.loadAnimation({
                            renderer: 'canvas',
                            loop: name === 'processing' || name === 'start' || name === 'about' || name === 'symbol',
                            autoplay: false,
                            animationData,
                            rendererSettings: {
                                context: ctx,
                                scaleMode: 'noScale',
                                clearCanvas: true
                            },
                        })
                    };
                    ctx.clearRect(0, 0, 1000, 1000);
                    resolve();
                } else {
                    reject();
                }
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    });
}

/**
 * @return {Promise<void>}
 */
async function initLotties() {
    const divs = $$('tgs-player');
    for (let i = 0; i < divs.length; i++) {
        try {
            await initLottie(divs[i]);
        } catch (e) {
        }
    }
}

/**
 * @param lottie?   {any}
 * @param visible   {boolean}
 * @param params?    {{hideDelay?: number}}
 */
function toggleLottie(lottie, visible, params) {
    if (!lottie) return;

    params = params || {};
    clearTimeout(lottie.hideTimeout);
    if (visible) {
        lottie.player.play();
    } else {
        lottie.player.stop();

        if (params.hideDelay) {
            lottie.hideTimeout = setTimeout(() => {
                lottie.ctx.clearRect(0, 0, 1000, 1000);
            }, params.hideDelay);
        } else {
            lottie.ctx.clearRect(0, 0, 1000, 1000);
        }
    }
}


;// CONCATENATED MODULE: ./src/js/view/DropDown.js


class DropDown {
    /**
     * @param container {HTMLElement}
     * @param onEnter   {(input: HTMLInputElement) => void}
     * @param mnemonicWords {string[]}
     */
    constructor(container, onEnter, mnemonicWords) {
        /** @type {HTMLElement} */
        this.container = container;
        /** @type {(input: HTMLInputElement) => void} */
        this.onEnter = onEnter;
        /** @type {string[]} */
        this.mnemonicWords = mnemonicWords;
        /** @type {number} */
        this.selectedI = -1;
    }

    /**
     * @param input {HTMLInputElement}
     * @param text  {string}
     */
    show(input, text) {
        clearElement(this.container);

        /**
         * @param e {MouseEvent}
         */
        const onMouseDown = e => {
            input.value = e.target.innerText;
            input.classList.remove('error');
            this.hide();
            e.preventDefault();
            this.onEnter(input);
        };

        this.mnemonicWords
            .filter(w => w.indexOf(text) === 0)
            .forEach(w => {
                const item = createElement({tag: 'div', clazz: 'words-popup-item', text: w});
                item.addEventListener('mousedown', onMouseDown);
                this.container.appendChild(item);
            });

        this.selectedI = -1;
        if (this.container.children.length > 0) this.select(0);

        this.container.style.left = input.offsetLeft + 'px';
        this.container.style.top = (input.offsetTop + input.offsetHeight) + 'px';
        toggle(this.container, true);
    };

    hide() {
        toggle(this.container, false);
        clearElement(this.container);
        this.selectedI = -1;
    }

    /**
     * @param i {number}
     */
    select(i) {
        if (this.selectedI > -1) {
            this.container.children[this.selectedI].classList.remove('selected');
        }
        this.selectedI = i;
        if (this.selectedI > -1) {
            this.container.children[this.selectedI].classList.add('selected');
            const ITEM_HEIGHT = 30;
            this.container.scrollTo(0, ITEM_HEIGHT * this.selectedI);
        }
    }

    /**
     * @return {null | string}
     */
    getSelectedText() {
        if (this.selectedI === -1) return null;
        return this.container.children[this.selectedI].innerText;
    }

    up() {
        if (this.selectedI === -1) return;

        if (this.selectedI > 0) {
            this.select(this.selectedI - 1);
        }
    }

    down() {
        if (this.selectedI === -1) return;

        if (this.selectedI < this.container.children.length - 1) {
            this.select(this.selectedI + 1);
        }
    }
}

;// CONCATENATED MODULE: ./src/js/view/View.js





const toNano = TonWeb.utils.toNano;
const fromNano = TonWeb.utils.fromNano;
const BN = TonWeb.utils.BN;

const IS_EXTENSION = !!(self.chrome && chrome.runtime && chrome.runtime.onConnect);
const IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/**
 * @param text  {string}
 * @param containerSelector {string}
 */
const drawQRCode = (text, containerSelector) => {
    const $container = $(containerSelector);

    clearElement($container);

    new QRCode($container, {
        text: text,
        width: 185 * window.devicePixelRatio,
        height: 185 * window.devicePixelRatio,
        colorDark: '#303757',
        logo: "assets/ui/qr-logo.png",
        logoBackgroundTransparent: false,
        logoWidth: 44 * window.devicePixelRatio,
        logoHeight: 44 * window.devicePixelRatio,
        correctLevel: QRCode.CorrectLevel.L
    });

    const canvas = $container.querySelector('canvas');
    canvas.style.width = '185px';
    canvas.style.height = '185px';
};

class View {
    /**
     * @param mnemonicWords {string[]}
     */
    constructor(mnemonicWords) {
        /** @type   {string[]} */
        this.mnemonicWords = mnemonicWords;
        /** @type {Controller | null} */
        this.controller = null;
        /** @type {any | null} */
        this.port = null;
        /** @type   {string | null} */
        this.myAddress = null;
        /** @type   {string | null} */
        this.address = null;
        /** @type   {BN | null} */
        this.balance = null;
        /** @type   {string | null} */
        this.currentScreenName = null;
        /** @type   {boolean} */
        this.isTestnet = false;
        /** @type   {string} */
        this.popup = ''; // current opened popup name

        /** @type   {boolean} */
        this.isBack = false;
        /** @type   {number} */
        this.backupShownTime = 0;

        /** @type {any | null} */
        this.currentOpenTransaction = null;

        /** @type {string | null} */
        this.currentTransactionAddr = null;

        this.createWordInputs({
            count: IMPORT_WORDS_COUNT,
            dropdownId: '#wordsPopup',
            inputId: '#importsInput',
            containerId: '#importWords',
            multiColumns: true
        });
        this.createWordInputs({
            count: CONFIRM_WORDS_COUNT,
            dropdownId: '#wordsConfirmPopup',
            inputId: '#confirmInput',
            containerId: '#confirmWords',
            multiColumns: false
        });

        /** @type {Promise<void>} */
        this._initLotties = initLotties().then(() => {
            if (this.currentScreenName) {
                toggleLottie(lotties[this.currentScreenName], true);
                toggleLottie(lotties['symbol'], this.currentScreenName === 'main');
            }
        });

        /**
         * @param e {Event}
         */
        function resetErrors(e) {
            const input = e.target;
            input.classList.remove('error');
        }

        onInput($('#amountInput'), resetErrors);
        onInput($('#toWalletInput'), resetErrors);
        onInput($('#commentInput'), resetErrors);
        onInput($('#createPassword_repeatInput'), resetErrors);
        onInput($('#enterPassword_input'), resetErrors);
        onInput($('#changePassword_oldInput'), resetErrors);
        onInput($('#changePassword_newInput'), resetErrors);
        onInput($('#changePassword_repeatInput'), resetErrors);

        /**
         * @param e {ClipboardEvent}
         * @return {string}
         */
        function getClipboardData(e) {
            const s = (e.clipboardData || window.clipboardData).getData('text');
            try {
                return decodeURI(s).replaceAll(/%23/g, '#');
            } catch (e) { // URIError
                return s;
            }
        }

        $('#toWalletInput').addEventListener('paste', e => {
            const urlString = getClipboardData(e);

            if (!urlString.startsWith('ton://')) return;

            /** @type {{address: string, amount?: string, text?: string} | null } */
            let parsedTransferUrl = null;
            try {
                parsedTransferUrl = TonWeb.utils.parseTransferUrl(urlString);
            } catch (e) {
                $('#notify').innerText = 'Parse transfer URL error';
                triggerClass($('#notify'), 'faded-show', 2000);
                return;
            }

            $('#toWalletInput').value = parsedTransferUrl.address;

            if (parsedTransferUrl.amount) {
                $('#amountInput').value = fromNano(new BN(parsedTransferUrl.amount));
            }

            if (parsedTransferUrl.text) {
                $('#commentInput').value = parsedTransferUrl.text;
            }

            e.preventDefault();
        });

        onInput($('#invoice_amountInput'), () => this.updateInvoiceLink());
        onInput($('#invoice_commentInput'), () => this.updateInvoiceLink());

        $("#start_createBtn").addEventListener('click', () => this.sendMessage('showScreen', {name: 'created'}));
        $("#start_importBtn").addEventListener('click', () => this.sendMessage('showScreen', {name: 'import'}));

        /** @type {boolean} */
        let needShowLedger = false;
        try {
            needShowLedger = window.location.href.indexOf('ledgerReview') > -1;
        } catch (e) {

        }
        if (needShowLedger) {
            toggle($("#start_importLedgerHidBtn"), 'inline-block');
        }

        $("#start_importLedgerHidBtn").addEventListener('click', () => {
            this.showPopup('connectLedger');
            this.sendMessage('showScreen', {name: 'importLedger', transportType: 'hid'});
        });
        // $("#start_importLedgerBleBtn").addEventListener('click', () => this.sendMessage('showScreen', {name: 'importLedger', transportType: 'ble'}));

        // $('#main_buyBtn').addEventListener('click', () => {
        //     window.open('https://exchange.mercuryo.io/?currency=TONCOIN&address=' + this.myAddress, '_blank');
        // });

        $('#import_backBtn').addEventListener('click', () => {
            this.isBack = true;
            this.sendMessage('onImportBack');
        });

        $('#import_alertBtn').addEventListener('click', () => {
            this.showAlert({
                title: 'Too Bad',
                message: 'Without the secret words, you can\'t restore access to your wallet.',
                buttons: [
                    {
                        label: 'CANCEL',
                        callback: () => {
                            this.isBack = true;
                            this.sendMessage('onImportBack');
                        }
                    },
                    {
                        label: 'ENTER WORDS',
                        callback: () => {
                            this.closePopup();
                        }
                    },
                ]
            });
        });
        $('#import_continueBtn').addEventListener('click', async (e) => {
            this.toggleButtonLoader(e.currentTarget, true);
            this.sendMessage('import', {words: await this.getImportWords()});
        });

        $('#createdContinueButton').addEventListener('click', () => this.sendMessage('createPrivateKey'));

        $('#backup_continueBtn').addEventListener('click', () => {
            const currentTime = Date.now();
            if (currentTime - this.backupShownTime < 60000) { // 1 minute
                this.showAlert({
                    title: 'Sure done?',
                    message: 'You didn\'t have enough time to write these words down.',
                    buttons: [
                        {
                            label: 'I\'M SURE',
                            callback: () => {
                                this.sendMessage('onBackupDone');
                            }
                        },
                        {
                            label: 'OK, SORRY',
                            callback: () => {
                                this.closePopup();
                            }
                        },
                    ]
                });
            } else {
                this.sendMessage('onBackupDone');
            }
        });

        $('#wordsConfirm_backBtn').addEventListener('click', () => {
            this.isBack = true;
            this.sendMessage('onConfirmBack');
        });

        $('#wordsConfirm_continueBtn').addEventListener('click', () => {
            const confirmWords = this.getConfirmWords();

            if (!confirmWords.isWordsFromList) {
                return;
            }

            if (!confirmWords.isRightWords) {
                this.showAlert({
                    title: 'Incorrect words',
                    message: 'The secret words you have entered do not match the ones in the list.',
                    buttons: [
                        {
                            label: 'SEE WORDS',
                            callback: () => {
                                this.isBack = true;
                                this.sendMessage('onConfirmBack');
                            }
                        },
                        {
                            label: 'TRY AGAIN',
                            callback: () => {
                                this.closePopup();
                            }
                        },
                    ]
                });
            } else {
                this.sendMessage('onConfirmDone', {words: confirmWords.words});
            }
        });


        $('#createPassword_continueBtn').addEventListener('click', (e) => {
            /** @type {string} */
            const password = $('#createPassword_input').value;
            /** @type {string} */
            const passwordRepeat = $('#createPassword_repeatInput').value;

            const isEmpty = password.length === 0 && !this.isTestnet;

            if (isEmpty) {
                $('#createPassword_input').classList.add('error');
            } else if (password !== passwordRepeat) {
                $('#createPassword_repeatInput').classList.add('error');
            } else {
                this.toggleButtonLoader(e.currentTarget, true);
                this.sendMessage('passwordCreated', {password});
            }
        });

        $('#readyToGo_continueBtn').addEventListener('click', () => this.sendMessage('showMain'));

        $('#main_refreshBtn').addEventListener('click', () => {
            this.setUpdating(true);
            this.sendMessage('update');
        });
        $('#main_settingsButton').addEventListener('click', () => this.onSettingsClick());

        $('#main_receiveBtn').addEventListener('click', () => {
            toggle($('#receive_showAddressOnDeviceBtn'), !!this.isLedger);
            this.showPopup('receive');
        });
        $('#sendButton').addEventListener('click', () => this.onMessage('showPopup', {name: 'send'}));

        $('#modal').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup();
        });

        if (IS_FIREFOX) {
            toggle($('#menu_magic'), false);
            toggle($('.about-magic'), false);
        }

        $('#menu_magic').addEventListener('click', () => {
            $('#menu_magic .dropdown-toggle').classList.toggle('toggle-on');
            const isTurnedOn = $('#menu_magic .dropdown-toggle').classList.contains('toggle-on');
            $('#menu_telegram').classList.toggle('menu_telegram-show', isTurnedOn);
            this.sendMessage('onMagicClick', isTurnedOn);
        });

        $('#menu_telegram').addEventListener('click', () => {
            window.open('https://web.telegram.org/z', '_blank');
        });

        $('#menu_proxy').addEventListener('click', () => {
            $('#menu_proxy .dropdown-toggle').classList.toggle('toggle-on');
            this.sendMessage('onProxyClick', $('#menu_proxy .dropdown-toggle').classList.contains('toggle-on'));
        });

        $('#menu_extension_chrome').addEventListener('click', () => window.open('https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd', '_blank'));
        $('#menu_extension_firefox').addEventListener('click', () => window.open('https://addons.mozilla.org/ru/firefox/addon/', '_blank'));
        $('#menu_about').addEventListener('click', () => this.showPopup('about'));
        $('#menu_changePassword').addEventListener('click', () => this.onMessage('showPopup', {name: 'changePassword'}));
        $('#menu_backupWallet').addEventListener('click', () => this.sendMessage('onBackupWalletClick'));
        $('#menu_delete').addEventListener('click', () => this.showPopup('delete'));

        $('#receive_showAddressOnDeviceBtn').addEventListener('click', () => this.onShowAddressOnDevice());
        $('#receive_invoiceBtn').addEventListener('click', () => this.onCreateInvoiceClick());
        $('#receive_shareBtn').addEventListener('click', () => this.onShareAddressClick(false));
        $('#receive .addr').addEventListener('click', () => this.onShareAddressClick(true));
        $('#receive_closeBtn').addEventListener('click', () => this.closePopup());

        $('#invoice_qrBtn').addEventListener('click', () => this.onCreateInvoiceQrClick());
        $('#invoice_shareBtn').addEventListener('click', () => this.onShareInvoiceClick());
        $('#invoice_closeBtn').addEventListener('click', () => this.showPopup('receive'));

        $('#invoiceQr_shareBtn').addEventListener('click', () => this.onShareInvoiceClick());
        $('#invoiceQr_closeBtn').addEventListener('click', () => this.showPopup('invoice'));

        $('#transaction_sendBtn').addEventListener('click', () => this.onTransactionButtonClick());
        $('#transaction_closeBtn').addEventListener('click', () => this.closePopup());

        $('#connectLedger_cancelBtn').addEventListener('click', () => this.closePopup());

        $('#send_btn').addEventListener('click', (e) => {
            /** @type {string} */
            const amount = $('#amountInput').value;
            /** @type {BN} */
            const amountNano = toNano(amount);
            if (!amountNano.gt(new BN(0)) || this.balance.lt(amountNano)) {
                $('#amountInput').classList.add('error');
                return;
            }

            /** @type {string} */
            const toAddressString = $('#toWalletInput').value;
            /** @type {Address | null} */
            let toAddress = null;
            try {
                toAddress = new TonWeb.utils.Address(toAddressString);
            } catch (e) {
            }
            if (!toAddressString.toLowerCase().endsWith('.ton') && !toAddressString.toLowerCase().endsWith('.t.me') && !toAddress) {
                $('#toWalletInput').classList.add('error');
                return;
            }

            /** @type {string} */
            const comment = $('#commentInput').value;
            /** @type {boolean} */
            const needEncryptComment = $('#encryptCommentCheckbox').checked;
            if (comment.length > 1024) {
                $('#commentInput').classList.add('error');
                $('#notify').innerText = 'Maximum 1024 symbols';
                triggerClass($('#notify'), 'faded-show', 2000);
                return;
            }

            // from https://github.com/tonkeeper/ton-assets/blob/main/accounts.json with "require_memo": true
            const exchangeAddresses = [
                '0:5f00decb7da51881764dc3959cec60609045f6ca1b89e646bde49d492705d77f', // OKX
                '0:b31535e934db05bbc220267467903c8108bdabcbc2a06588838b726ddf589ef0', // FTX
                '0:57eb74407604a19f7e04005315ef70aeb7b675e6551977586756f6baf12125ee', // MEXC
                '0:7994848c1fcbcbc57a6a5a987b66eb424b8b54e10759b6b514a66b600c2b0eef', // EXMO
                '0:8d195793baad9a08c46dc353aebe999341dabd07721b9725f19e18abc3d10d92', // EXMO Cold Storage 1
                '0:26ab8ae763a3a7c3067d882b7b01cd5d37254cb8768f57b6a47c00028effc7b8', // EXMO Cold Storage 2
                '0:0130c77346e9ed82df677d107ad6a775c11f9c18f6a05c0dd17906b355850dad', // EXMO Deposit
                '0:342a359e38357c083968129fddddf049ef5c47315bfbef27505a356bf9f02d65', // CoinEx
                '0:555f3053e257130374bb831ae0e219e5e5f9ec0ca8f8a0d133369d3d690c64c2', // Huobi Deposit
                '0:85af78e8d035e920117cda654615cdf371d464480b629e110d3c5310d85ab362', // Huobi
                '0:80d4123841167ca989ac912443cc99a4b9c1a87584536427ff6fd85c92395ae9', // Kucoin
                '0:a14b1f452385b2bb984ad2c4441e1d23cae071fdfc096dfba53ebba3b6ff1d10', // Lbank.info
                '0:c3f1da8ecda8f8cd42bace224ea3f1b6971eaa7f54c492d4d190527b4f573f7c', // Bybit
                '0:008bb088e81e38d583826901093567027cc1575ec744ac354fa4eeec302d166d', // bit.com
            ]

            const isExchange = toAddress && (exchangeAddresses.indexOf(toAddress.toString(false)) > -1);

            if (isExchange) {
                if (!comment) {
                    $('#notify').innerText = 'Exchange require text comment (MEMO) for deposit';
                    triggerClass($('#notify'), 'faded-show', 2000);
                    return;
                }

                if (comment && needEncryptComment) {
                    $('#notify').innerText = `Can't encrypt comment when depositing on exchange`;
                    triggerClass($('#notify'), 'faded-show', 2000);
                    return;
                }
            }

            this.toggleButtonLoader(e.currentTarget, true);
            this.sendMessage('onSend', {
                amount: amountNano.toString(),
                toAddress: toAddressString,
                comment,
                needEncryptComment
            });
        });
        $('#send_closeBtn').addEventListener('click', () => this.closePopup());

        $('#sendConfirm_closeBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup();
        });
        $('#sendConfirm_cancelBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup();
        });
        $('#sendConfirm_okBtn').addEventListener('click', () => this.onMessage('showPopup', {name: 'enterPassword'}));

        $('#signConfirm_closeBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup()
        });
        $('#signConfirm_cancelBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup()
        });
        $('#signConfirm_okBtn').addEventListener('click', () => this.onMessage('showPopup', {name: 'enterPassword'}));

        $('#connectConfirm_closeBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup()
        });
        $('#connectConfirm_cancelBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup()
        });
        $('#connectConfirm_okBtn').addEventListener('click', () => {
            this.sendMessage('onConnectConfirmed', {});
        });

        $('#processing_closeBtn').addEventListener('click', () => this.closePopup());
        $('#done_closeBtn').addEventListener('click', () => this.closePopup());
        $('#about_closeBtn').addEventListener('click', () => this.closePopup());
        $('#about_version').addEventListener('click', (e) => {
            if (e.shiftKey) {
                this.showAlert({
                    title: 'Are you sure you want to switch between mainnet/testnet?',
                    message: 'You can switch back the network by clicking on the version with the Shift key pressed',
                    buttons: [
                        {
                            label: 'I\'M SURE',
                            callback: () => {
                                this.sendMessage('toggleTestnet');
                            }
                        },
                        {
                            label: 'BACK',
                            callback: () => {
                                this.closePopup();
                            }
                        },
                    ]
                });
            } else if (e.altKey) {
                this.showAlert({
                    title: 'Are you sure you want to switch between clear console/debug mode?',
                    message: 'You can switch back the clear console by clicking on the version with the Alt key pressed',
                    buttons: [
                        {
                            label: 'I\'M SURE',
                            callback: () => {
                                this.sendMessage('toggleDebug');
                            }
                        },
                        {
                            label: 'BACK',
                            callback: () => {
                                this.closePopup();
                            }
                        },
                    ]
                });
            }
        });

        $('#changePassword_cancelBtn').addEventListener('click', () => this.closePopup());
        $('#changePassword_okBtn').addEventListener('click', async (e) => {
            /** @type {string} */
            const oldPassword = $('#changePassword_oldInput').value;
            /** @type {string} */
            const newPassword = $('#changePassword_newInput').value;
            /** @type {string} */
            const passwordRepeat = $('#changePassword_repeatInput').value;

            const isEmpty = newPassword.length === 0 && !this.isTestnet;

            if (isEmpty) {
                $('#changePassword_newInput').classList.add('error');
                return;
            }

            if (newPassword !== passwordRepeat) {
                $('#changePassword_repeatInput').classList.add('error');
                return;
            }

            this.toggleButtonLoader(e.currentTarget, true);
            this.sendMessage('onChangePassword', {oldPassword, newPassword});
        });

        $('#enterPassword_cancelBtn').addEventListener('click', () => {
            this.sendMessage('onCancelAction');
            this.closePopup();
        });
        $('#enterPassword_okBtn').addEventListener('click', async (e) => {
            /** @type {string} */
            const password = $('#enterPassword_input').value;

            this.toggleButtonLoader(e.currentTarget, true);
            this.sendMessage('onEnterPassword', {password});
        });

        $('#delete_cancelBtn').addEventListener('click', () => this.closePopup());
        $('#delete_okBtn').addEventListener('click', () => this.sendMessage('disconnect'));

        $('#transactionDecryptCommentButton').addEventListener('click', () => {
            if (!this.currentOpenTransaction) return;

            this.sendMessage('decryptComment', {
                hash: this.currentOpenTransaction.hash,
                senderAddress: this.currentOpenTransaction.from_addr,
                encryptedComment: this.currentOpenTransaction.encryptedComment,
            });
        });
    }

    // COMMON

    /**
     * @param name  {string}
     */
    showScreen(name) {
        this.closePopup();

        const screens = ['start', 'created', 'backup', 'wordsConfirm', 'import', 'createPassword', 'readyToGo', 'main'];

        screens.forEach(screen => {
            toggleFaded($('#' + screen), name === screen, {
                isBack: this.isBack,
            });

            toggleLottie(lotties[screen], name === screen, {hideDelay: 300}); // 300ms, as for screen show/hide animation duration in CSS
        });
        toggleLottie(lotties['symbol'], name === 'main', {hideDelay: 300});
        this.currentScreenName = name;

        this.isBack = false;

        window.scrollTo(0, 0);
    }

    /**
     * @param el    {HTMLElement}
     * @param enable    {boolean}
     */
    toggleButtonLoader(el, enable) {
        el.disabled = enable;
        enable ? el.classList.add('btn-loader') : el.classList.remove('btn-loader');
    }

    /**
     * @param params    {{title: string, message: string, buttons?: {label: string, callback: () => void}[]}}
     */
    showAlert(params) {
        $('#alert .popup-title').innerText = params.title;
        $('#alert .popup-black-text').innerText = params.message;
        $('#alert .popup-footer').innerHTML = '';

        if (params.buttons) {
            params.buttons.forEach(button => {
                const el = createElement({
                    tag: 'button',
                    clazz: 'btn-lite',
                    text: button.label
                });
                $('#alert .popup-footer').appendChild(el);
                el.addEventListener('click', button.callback);
            });
        }

        this.showPopup('alert');
    }

    /**
     * @param name  {string}
     */
    showPopup(name) {
        this.popup = name;

        $('#enterPassword_input').value = '';

        //popups switching without animations
        if (this.popup && name) {
            triggerClass(document.body, 'disable-animations', 20);
        }

        toggleFaded($('#modal'), name !== '');

        const popups = ['alert', 'receive', 'invoice', 'invoiceQr', 'send', 'sendConfirm', 'signConfirm', 'connectConfirm', 'processing', 'done', 'menuDropdown', 'about', 'delete', 'changePassword', 'enterPassword', 'transaction', 'connectLedger', 'loader'];

        popups.forEach(popup => {
            toggleFaded($('#' + popup), name === popup);
            toggleLottie(lotties[popup], name === popup);
        });
    }

    closePopup() {
        this.currentOpenTransaction = null;
        this.showPopup('');
        this.sendMessage('onClosePopup');
    }

    // BACKUP SCREEN

    /**
     * @param words {string[]}
     */
    setBackupWords(words) {
        /**
         * @param n {number}
         */
        const createBackupWord = n => {
            $('#createWords').appendChild(
                createElement({
                    tag: 'div',
                    clazz: 'create-word-item',
                    child: [
                        createElement({
                            tag: 'span',
                            clazz: 'word-num',
                            text: (n + 1) + '.'
                        }),
                        createElement({
                            tag: 'span',
                            style: {
                                'font-weight': 'bold'
                            },
                            text: words[n]
                        })
                    ]
                })
            );
        };

        clearElement($('#createWords'));
        for (let i = 0; i < words.length / 2; i++) {
            createBackupWord(i);
            createBackupWord(i + 12);
        }
    }

    clearBackupWords() {
        clearElement($('#createWords'));
    }

    // IMPORT && CONFIRM SCREENS

    /**
     * @param params    {{count: number, containerId: string, inputId: string, dropdownId: string, multiColumns: boolean}}
     */
    createWordInputs(params) {

        /**
         * @param input {HTMLInputElement}
         */
        const onEnter = input => {
            const i = Number(input.getAttribute('tabindex'));
            if (i === params.count) {

            } else {
                $(params.inputId + i).focus();
            }
        };

        const dropdown = new DropDown($(params.dropdownId), onEnter, this.mnemonicWords);

        /** @type {HTMLInputElement | null} */
        let lastInput = null;

        /**
         * @param input {HTMLInputElement}
         */
        const showWordsPopup = input => {
            const text = input.value;
            if (text === null || text.length === 0) {
                toggle($(params.dropdownId), false);
                return;
            }

            dropdown.show(input, text.toLowerCase());
        };

        /**
         * @param e {Event}
         */
        function onWordInput(e) {
            /** @type {HTMLInputElement} */
            const input = e.target;
            input.classList.remove('error');

            showWordsPopup(input);
        }

        /**
         * @param e {Event}
         */
        const onFocusIn = (e) => {
            /** @type {HTMLInputElement} */
            const input = e.target;
            lastInput = input;
            showWordsPopup(input);
        };

        /**
         * @param e {Event}
         */
        const onFocusOut = (e) => {
            toggle($(params.dropdownId), false);
            if (lastInput) {
                const value = lastInput.value.toLowerCase().trim();
                if (value.length > 0 && this.mnemonicWords.indexOf(value) === -1) {
                    lastInput.classList.add('error');
                } else {
                    lastInput.classList.remove('error');
                }
            }
        };

        /**
         * @param e {KeyboardEvent}
         */
        const onKeyDown = (e) => {
            /** @type {HTMLInputElement} */
            const input = e.target;
            switch (e.key) {
                case 'Enter':
                    const selectedText = dropdown.getSelectedText();
                    if (selectedText) {
                        input.value = selectedText;
                        input.classList.remove('error');
                        dropdown.hide();
                    }
                    onEnter(input);
                    break;
                case 'ArrowUp':
                    dropdown.up();
                    break;
                case 'ArrowDown':
                    dropdown.down();
                    break;
            }
        };

        /**
         * @param event {ClipboardEvent}
         */
        const onPaste = (event) => {
            const text = (event.clipboardData || window.clipboardData).getData('text');
            let arr = text.split(' ');
            if (arr.length !== params.count) {
                arr = text.split(',');
            }
            if (arr.length === params.count) {
                for (let i = 0; i < params.count; i++) {
                    /** @type {HTMLInputElement} */
                    const input = $(params.inputId + i);
                    const value = arr[i].toLowerCase().trim();
                    if (!value || this.mnemonicWords.indexOf(value) === -1) {
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                    input.value = value;
                }
                event.preventDefault();
            }
        };

        /**
         * @param n {number}
         */
        const createInput = (n) => {
            const inputContainer = createElement({tag: 'div', clazz: 'word-item'});
            const span = createElement({tag: 'span', clazz: 'word-num', text: (n + 1) + '.'});
            inputContainer.appendChild(span);
            /** @type {HTMLInputElement} */
            const input = createElement({tag: 'input'});
            input.id = params.inputId.slice(1) + n;
            input.type = 'text';
            input.tabIndex = n + 1;
            input.autocomplete = 'off';
            inputContainer.appendChild(input);

            input.addEventListener('focusin', onFocusIn);
            input.addEventListener('focusout', onFocusOut);
            input.addEventListener('keydown', onKeyDown);
            input.addEventListener('paste', onPaste);
            onInput(input, onWordInput);

            $(params.containerId).appendChild(inputContainer);
        };

        if (params.multiColumns) {
            for (let i = 0; i < params.count / 2; i++) {
                createInput(i);
                createInput(i + params.count / 2);
            }
        } else {
            for (let i = 0; i < params.count; i++) {
                createInput(i);
            }
        }
    }

    clearImportWords() {
        toggle($('#wordsPopup'), false);
        for (let i = 0; i < IMPORT_WORDS_COUNT; i++) {
            /** @type {HTMLInputElement} */
            const input = $('#importsInput' + i);
            input.value = '';
            input.classList.remove('error');
        }
    }

    clearConfirmWords() {
        toggle($('#wordsConfirmPopup'), false);
        for (let i = 0; i < CONFIRM_WORDS_COUNT; i++) {
            /** @type {HTMLInputElement} */
            const input = $('#confirmInput' + i);
            input.value = '';
            input.setAttribute('data-word', '');
            input.classList.remove('error');
        }
    }

    /**
     * @param words {string[]}
     */
    setConfirmWords(words) {
        /** @type {number[]} */
        const nums = Array(IMPORT_WORDS_COUNT)
            .fill(0)
            .map((_, index) => ({index, rnd: Math.random()}))
            .sort((a, b) => a.rnd - b.rnd)
            .map(item => item.index)
            .slice(0, CONFIRM_WORDS_COUNT)
            .sort((a, b) => a - b);

        const spans = $$('#confirmWordsNums span');
        for (let i = 0; i < CONFIRM_WORDS_COUNT; i++) {
            /** @type {HTMLInputElement} */
            const input = $('#confirmInput' + i);
            input.setAttribute('data-index', nums[i].toString());
            input.setAttribute('data-word', words[nums[i]]);
            spans[i].innerText = (nums[i] + 1).toString();
            input.parentNode.children[0].innerText = (nums[i] + 1) + '.';
        }
    }

    /**
     * @return {Promise<string[] | null>}
     */
    async getImportWords() {
        /** @type {boolean} */
        let isValid = true;
        /** @type {string[]} */
        const words = [];
        for (let i = 0; i < IMPORT_WORDS_COUNT; i++) {
            /** @type {HTMLInputElement} */
            const input = $('#importsInput' + i);
            /** @type {string} */
            const value = input.value.toLowerCase().trim();
            if (!value || this.mnemonicWords.indexOf(value) === -1) {
                input.classList.add('error');
                isValid = false;
            }
            words.push(value);
        }

        if (isValid) {
            isValid = await TonWeb.mnemonic.validateMnemonic(words);
            if (!isValid) {
                for (let i = 0; i < IMPORT_WORDS_COUNT; i++) {
                    const input = $('#importsInput' + i);
                    input.classList.add('error');
                }
            }
        }

        return isValid ? words : null;
    }

    /**
     * @return {{isWordsFromList: boolean, isRightWords: boolean, words: null | Object<string, string>}} words - index to word
     */
    getConfirmWords() {
        /** @type {boolean} */
        let isWordsFromList = true;
        /** @type {boolean} */
        let isRightWords = true;
        /** @type {Object<string, string>} */
        const words = {};

        for (let i = 0; i < CONFIRM_WORDS_COUNT; i++) {
            /** @type {HTMLInputElement} */
            const input = $('#confirmInput' + i);
            /** @type {string} */
            const value = input.value.toLowerCase().trim();
            /** @type {string} */
            const index = input.getAttribute('data-index');
            /** @type {string} */
            const validValue = input.getAttribute('data-word');
            if (!value || this.mnemonicWords.indexOf(value) === -1) {
                input.classList.add('error');
                isWordsFromList = false;
            }
            if (value !== validValue) {
                isRightWords = false;
            }
            words[index] = value;
        }

        return {
            isWordsFromList,
            isRightWords,
            words: isWordsFromList && isRightWords ? words : null
        };
    }

    // CREATE PASSWORD SCREEN

    clearCreatePassword() {
        $('#createPassword_input').value = '';
        $('#createPassword_repeatInput').value = '';
    }

    // CHANGE PASSWORD POPUP

    clearChangePassword() {
        $('#changePassword_oldInput').value = '';
        $('#changePassword_newInput').value = '';
        $('#changePassword_repeatInput').value = '';
    }

    // MAIN SCREEN

    /**
     * @param updating  {boolean}
     */
    setUpdating(updating) {
        $('#updateLabel').innerText = updating ? 'updating..' : 'updated just now';
    }

    onSettingsClick() {
        toggleFaded($('#modal'), true);
        toggleFaded($('#menuDropdown'), true);
        toggle($('#menu_changePassword'), !this.isLedger);
        toggle($('#menu_backupWallet'), !this.isLedger);
    }

    clearBalance() {
        clearElement($('#balance'));
        clearElement($('#transactionsList'));
        toggle($('#walletCreated'), false);
    }

    /**
     * @param balance   {BN}
     * @param txs   {any[]}
     */
    setBalance(balance, txs) {
        this.balance = balance;
        /** @type {string} */
        let s = fromNano(balance);
        if (s === '0') s = '0.00';
        const i = s.indexOf('.');
        const first = s.substring(0, i);
        const last = s.substring(i);

        clearElement($('#balance'));
        $('#balance').appendChild(createElement({tag: 'span', text: first}));
        $('#balance').appendChild(createElement({tag: 'span', style: {'font-size': '24px'}, text: last}));

        $('#sendBalance').innerText = 'Balance: ' + s + ' 💎';
        toggle($('#sendButton'), balance.gt(new BN(0)) ? 'inline-block' : 'none');
        this.setTransactions(txs);
        this.setUpdating(false);
    }

    /**
     * @param txs   {any[]}
     */
    setTransactions(txs) {
        clearElement($('#transactionsList'));
        /** @type {string} */
        let date = '';

        toggle($('#walletCreated'), txs.length === 0);

        txs.forEach(tx => {
            tx.amount = new BN(tx.amount);
            tx.fee = new BN(tx.fee);
            tx.date = new Date(tx.date);

            /** @type {string} */
            const txDate = formatDate(tx.date);
            if (date !== txDate) {
                this.addDateSeparator(txDate);
                date = txDate;
            }
            this.addTx(tx);
        });
    }

    /**
     * @param dateString    {string}
     */
    addDateSeparator(dateString) {
        $('#transactionsList').appendChild(createElement({tag: 'div', clazz: 'date-separator', text: dateString}));
    }

    /**
     * @param tx    {any}
     */
    addTx(tx) {
        /** @type {boolean} */
        const isReceive = tx.inbound;
        /** @type {string} */
        const amountFormatted = fromNano(tx.amount);
        /** @type {string} */
        const addr = isReceive ? tx.from_addr : tx.to_addr;

        const item = createElement({
            tag: 'div',
            clazz: 'tx-item',
            child: [
                createElement({
                    tag: 'div',
                    child: isReceive ? [
                        createElement({
                            tag: 'span',
                            clazz: ['tx-amount', 'tx-amount-green'],
                            text: '+' + amountFormatted
                        }),
                        createElement({tag: 'span', text: ' 💎'}),
                        createElement({tag: 'span', clazz: 'tx-from', text: ' from:'})
                    ] : [
                        createElement({tag: 'span', clazz: 'tx-amount', text: amountFormatted}),
                        createElement({tag: 'span', text: ' 💎'}),
                        createElement({tag: 'span', clazz: 'tx-from', text: ' to:'})
                    ]
                }),
                setAddr(createElement({tag: 'div', clazz: ['tx-addr', 'addr']}), addr),
                tx.encryptedComment ? createElement({tag: 'div', clazz: 'tx-item-encrypted-icon'}) : undefined,
                tx.comment ? createElement({tag: 'div', clazz: 'tx-comment', text: tx.comment}) : undefined,
                createElement({tag: 'div', clazz: 'tx-fee', text: `blockchain fees: ${fromNano(tx.fee)}`}),
                createElement({tag: 'div', clazz: 'tx-item-date', text: formatTime(tx.date)})
            ]
        });

        item.addEventListener('click', () => this.onTransactionClick(tx));

        $('#transactionsList').appendChild(item);
    }

    // TRANSACTION POPUP

    /**
     * @param tx    {any}
     */
    onTransactionClick(tx) {
        this.currentOpenTransaction = tx;
        this.showPopup('transaction');
        /** @type {boolean} */
        const isReceive = tx.inbound;
        /** @type {string} */
        const amountFormatted = fromNano(tx.amount);
        /** @type {string} */
        const addr = isReceive ? tx.from_addr : tx.to_addr;
        this.currentTransactionAddr = addr;
        $('#transactionAmount').innerText = (isReceive ? '+' + amountFormatted : amountFormatted) + ' 💎';
        $('#transactionFee').innerText = fromNano(tx.fee) + ' transaction fee';
        $('#transactionSenderLabel').innerText = isReceive ? 'Sender' : 'Recipient';
        setAddr($('#transactionSender'), addr);
        toggle($('#transactionCommentLabel'), !!tx.comment || !!tx.encryptedComment);
        toggle($('#transactionDecryptCommentButton'), !!tx.encryptedComment);
        toggle($('#transactionComment'), !!tx.comment);
        $('#transactionComment').innerText = tx.comment;
        $('#transactionDate').innerText = formatDateFull(tx.date);
    }

    onTransactionButtonClick() {
        this.onMessage('showPopup', {name: 'send', toAddr: this.currentTransactionAddr});
    }

    // SEND POPUP

    clearSend() {
        $('#toWalletInput').value = '';
        $('#amountInput').value = '';
        $('#commentInput').value = '';
        $('#encryptCommentCheckbox').checked = false;
    }

    // RECEIVE POPUP

    /**
     * @param address   {string}
     */
    setMyAddress(address) {
        setAddr($('#receive .addr'), address);
        drawQRCode(TonWeb.utils.formatTransferUrl(address), '#qr');
        this.address = address;
        this.loadDiamond(address);
    }

    /**
     * @param address   {string}
     * @return {Promise<void>}
     */
    async loadDiamond(address) {
        toggle($('.balance-symbol'), true);
        toggle($('.balance-diamond-container'), false);
        toggle($('#diamond'), false);

        try {
            if (this.isTestnet) return;
            const res = await fetch("https://ton.diamonds/api/wallet/diamond_nfts?address=EQBzickUjZ1wUA1HW4Qlx8TSrHOn8jv365M_8Sf6xCRb1nj8&perPage=1&current=1");
            if (res.status !== 200) return;
            const json = await res.json();
            if (json.ok !== true) return;
            if (json.result.total < 1) return;
            const nftNumber = json.result.rows[0].nftNumber;
            const diamondImageUrl = 'https://nft.ton.diamonds/nft/' + nftNumber + '/' + nftNumber + '_diamond.svg';
            if (address === this.address) {
                toggle($('.balance-symbol'), false);
                $('#diamond').style.backgroundImage = 'url("' + diamondImageUrl + '")';
                toggle($('.balance-diamond-container'), true);
                toggle($('#diamond'), true);
            }
        } catch (e) {
            console.error('Diamonds Error', e);
        }
    }

    /**
     * @param onyAddress    {boolean} share address or transfer link
     */
    onShareAddressClick(onyAddress) {
        const data = onyAddress ? this.myAddress : TonWeb.utils.formatTransferUrl(this.myAddress);
        const text = onyAddress ? 'Wallet address copied to clipboard' : 'Transfer link copied to clipboard';
        $('#notify').innerText = copyToClipboard(data) ? text : 'Can\'t copy link';
        triggerClass($('#notify'), 'faded-show', 2000);
    }

    onShowAddressOnDevice() {
        this.sendMessage('showAddressOnDevice');
        $('#notify').innerText = 'Please check the address on your device';
        triggerClass($('#notify'), 'faded-show', 2000);
    }

    // RECEIVE INVOICE POPUP

    onCreateInvoiceClick() {
        this.onMessage('showPopup', {name: 'invoice'});
    }

    updateInvoiceLink() {
        $('#invoice_link').innerText = this.getInvoiceLink();
    };

    /**
     * @return {string}
     */
    getInvoiceLink() {
        const amountString = $('#invoice_amountInput').value;
        /** @type {string | undefined} */
        const amount = amountString ? toNano(amountString).toString() : undefined;
        return TonWeb.utils.formatTransferUrl(this.myAddress, amount, $('#invoice_commentInput').value);
    }

    onShareInvoiceClick() {
        $('#notify').innerText = copyToClipboard(this.getInvoiceLink()) ? 'Transfer link copied to clipboard' : 'Can\'t copy link';
        triggerClass($('#notify'), 'faded-show', 2000);
    }

    // RECEIVE INVOICE QR POPUP

    onCreateInvoiceQrClick() {
        this.onMessage('showPopup', {name: 'invoiceQr'});
    }

    /**
     * @param link  {string}
     */
    drawInvoiceQr(link) {
        drawQRCode(link, '#invoiceQrImg');
    }

    // TRANSPORT WITH CONTROLLER

    /**
     * Send message to Controller.js
     * @param method    {string}
     * @param params?    {any}  boolean or object, not array
     */
    sendMessage(method, params) {
        if (this.controller) {
            this.controller.onViewMessage(method, params);
        } else {
            this.port.postMessage({method, params});
        }
    }

    /**
     * Receive message from Controller.js
     * @param method    {string}
     * @param params?    {any} boolean or object, not array
     * @return {undefined | {magic: string | null, proxy: string | null, address: string | null, words: string | null, walletVersion: string | null}}
     */
    onMessage(method, params) {
        switch (method) {
            case 'disableCreated':
                $('#createdContinueButton').disabled = params;
                break;

            case 'setIsTestnet':
                this.isTestnet = params;
                $('.your-balance').innerText = params ? 'Your testnet balance' : 'Your mainnet balance';
                break;

            case 'setBalance':
                this.setBalance(new BN(params.balance), params.txs);
                break;

            case 'setIsLedger':
                this.isLedger = params;
                break;

            case 'setIsMagic':
                const isTurnedOn = params;
                $('#menu_magic .dropdown-toggle').classList.toggle('toggle-on', isTurnedOn && !IS_FIREFOX);
                $('#menu_telegram').classList.toggle('menu_telegram-show', isTurnedOn && !IS_FIREFOX);
                break;

            case 'setIsProxy':
                if (params) {
                    $('#menu_proxy .dropdown-toggle').classList.add('toggle-on');
                } else {
                    $('#menu_proxy .dropdown-toggle').classList.remove('toggle-on');
                }
                break;

            case 'privateKeySaved':
                this.toggleButtonLoader($('#createPassword_continueBtn'), false);
                break;

            case 'passwordChanged':
                this.toggleButtonLoader($('#changePassword_okBtn'), false);
                break;

            case 'showChangePasswordError':
                this.toggleButtonLoader($('#changePassword_okBtn'), false);
                $('#changePassword_oldInput').classList.add('error');
                break;

            case 'passwordEntered':
                this.toggleButtonLoader($('#enterPassword_okBtn'), false);
                break;

            case 'showEnterPasswordError':
                this.toggleButtonLoader($('#enterPassword_okBtn'), false);
                $('#enterPassword_input').classList.add('error');
                break;

            case 'importCompleted':
                this.toggleButtonLoader($('#import_continueBtn'), false);
                break;

            case 'sendCheckFailed':
                if (params && params.message) {
                    $('#notify').innerText = params.message;
                    triggerClass($('#notify'), 'faded-show', 3000);
                }

                this.toggleButtonLoader($('#send_btn'), false);
                break;

            case 'sendCheckSucceeded':
                this.toggleButtonLoader($('#send_btn'), false);
                break;

            case 'sendCheckCantPublicKey':
                this.toggleButtonLoader($('#send_btn'), false);
                $('#notify').innerText = `To encrypt a message, the destination wallet must have at least one outgoing transfer`;
                triggerClass($('#notify'), 'faded-show', 3000);
                break;

            case 'sendCheckCantPayFee':
                this.toggleButtonLoader($('#send_btn'), false);
                $('#amountInput').classList.add('error');

                $('#notify').innerText = `Estimated fee is ~${fromNano(params.fee)} TON`;
                triggerClass($('#notify'), 'faded-show', 3000);
                break;

            case 'decryptedComment':
                if (this.currentOpenTransaction && this.currentOpenTransaction.hash === params.hash) {
                    this.currentOpenTransaction.encryptedComment = null;
                    this.currentOpenTransaction.comment = params.decryptedComment;
                    this.onTransactionClick(this.currentOpenTransaction);
                }
                break;

            case 'showScreen':
                if (params.noAnimation) {
                    triggerClass(document.body, 'disable-animations', 300);
                }

                this.showScreen(params.name);

                switch (params.name) {
                    case 'start':
                        this.clearBalance();
                        this.clearImportWords();
                        break;
                    case 'created':
                        break;
                    case 'import':
                        this.clearImportWords();
                        $('#importsInput0').focus();
                        break;
                    case 'backup':
                        this.clearConfirmWords();
                        this.setBackupWords(params.words);
                        this.backupShownTime = params.isFirst ? (+new Date()) : 0;
                        break;
                    case 'wordsConfirm':
                        this.clearConfirmWords();
                        this.clearBackupWords();
                        $('#confirmInput0').focus();
                        this.setConfirmWords(params.words);
                        break;
                    case 'createPassword':
                        this.clearImportWords();
                        this.clearConfirmWords();
                        this.clearCreatePassword();
                        $('#createPassword_input').focus();
                        break;
                    case 'readyToGo':
                        this.clearCreatePassword();
                        break;
                    case 'main':
                        this.clearBackupWords();
                        if (params.myAddress) {
                            this.myAddress = params.myAddress;
                            this.setMyAddress(params.myAddress);
                        }
                        break;
                }
                break;

            case 'showPopup':
                this.showPopup(params.name);

                switch (params.name) {
                    case 'changePassword':
                        this.clearChangePassword();
                        $('#changePassword_oldInput').focus();
                        break;
                    case 'enterPassword':
                        $('#enterPassword_input').focus();
                        break;
                    case 'done':
                        $('#done .popup-grey-text').innerText = params.message;
                        break;
                    case 'invoice':
                        $('#invoice_amountInput').value = '';
                        $('#invoice_commentInput').value = '';
                        this.updateInvoiceLink();
                        $('#invoice_amountInput').focus();
                        break;
                    case 'invoiceQr':
                        this.drawInvoiceQr(this.getInvoiceLink());
                        $('#invoiceQrAmount').innerText = $('#invoice_amountInput').value;
                        break;
                    case 'send':
                        this.clearSend();
                        if (params.toAddr) {
                            $('#toWalletInput').value = params.toAddr;
                        }
                        toggle($('#commentInput'), !this.isLedger);
                        toggle($('#encryptCommentCheckboxContainer'), !this.isLedger ? 'flex' : false);
                        $('#toWalletInput').focus();
                        break;
                    case 'sendConfirm':
                        $('#sendConfirmAmount').innerText = fromNano(new BN(params.amount)) + ' TON';
                        setAddr($('#sendConfirmAddr'), params.toAddress);
                        $('#sendConfirmFee').innerText = params.fee ? 'Fee: ~' + fromNano(new BN(params.fee)) + ' TON' : '';

                        toggle($('#sendConfirmNotEncryptedNote'), !params.needEncryptComment);
                        toggle($('#sendConfirm .popup-footer'), !this.isLedger);
                        toggle($('#sendConfirm_closeBtn'), !this.isLedger);
                        // todo: show label 'Please approve on device'
                        break;
                    case 'signConfirm':
                        $('#signConfirmText').innerText = params.isConnect ? 'Do you want to connect your wallet to this page?' : 'Do you want to sign:';
                        toggle($('#signConfirmData'), !params.isConnect);
                        toggle($('#signConfirmAlert'), !params.isConnect);

                        const hex = params.data.length > 48 ? params.data.substring(0, 47) + '…' : params.data;
                        setAddr($('#signConfirmData'), hex);
                        break;
                    case 'connectConfirm':
                        break;
                }
                break;

            case 'closePopup':
                this.closePopup();
                break;

            case 'restoreDeprecatedStorage':
                const address = localStorage.getItem('address');
                const words = localStorage.getItem('words');
                const walletVersion = localStorage.getItem('walletVersion');
                const magic = localStorage.getItem('magic');
                const proxy = localStorage.getItem('proxy');
                localStorage.clear();

                return {address, words, walletVersion, magic, proxy};

        }
    }
}

window.view = new View(TonWeb.mnemonic.wordlists.EN);

if (IS_EXTENSION) {

    // connect to background process

    const connectToBackground = () => {
        const port = chrome.runtime.connect({name: 'gramWalletPopup'});
        window.view.port = port;

        port.onMessage.addListener(data => {
            const result = window.view.onMessage(data.method, data.params);
            if (result && data.id) {
                port.postMessage({method: 'response', id: data.id, result});
            }
        });

        port.onDisconnect.addListener(() => {
            connectToBackground();
        });
    }

    connectToBackground();

    // remember extension position and size

    const startTrackWindowPositionAndSize = async () => {
        let prevWindow = await chrome.windows.getCurrent();

        setInterval(async () => {
            const currentWindow = await chrome.windows.getCurrent();

            if (
                currentWindow.top !== prevWindow.top ||
                currentWindow.left !== prevWindow.left ||
                currentWindow.height !== prevWindow.height ||
                currentWindow.width !== prevWindow.width
            ) {
                prevWindow = currentWindow;

                window.view.sendMessage('onWindowUpdate', {
                    top: currentWindow.top,
                    left: currentWindow.left,
                    height: currentWindow.height,
                    width: currentWindow.width
                });
            }
        }, 3000);
    }

    startTrackWindowPositionAndSize();
}

// show attention message in browser console

if (window.top == window && window.console) {
    /** @type {Object<string, string[]>} */
    const selfXssAttentions = {
        'ru-RU': ['Внимание!', 'Используя эту консоль, вы можете подвергнуться атаке Self-XSS, что позволит злоумышленникам завладеть вашим кошельком.\nНе вводите и не вставляйте программный код, который не понимаете.'],
        '*': ['Attention!', 'Using this console, you can be exposed to a Self-XSS attack, allowing attackers to take over your wallet.\nDo not enter or paste program code that you do not understand.']
    };

    /** @type {string} */
    const userLanguage = navigator.language || navigator.userLanguage;
    /** @type {string[]} */
    let localizedSelfXssAttention = selfXssAttentions[userLanguage];
    if (!localizedSelfXssAttention) localizedSelfXssAttention = selfXssAttentions['*'];

    console.log(
        '%c%s', 'color: red; background: yellow; font-size: 24px;', localizedSelfXssAttention[0]
    );
    console.log('%c%s', 'font-size: 18px;', localizedSelfXssAttention[1]);
}

/******/ })()
;