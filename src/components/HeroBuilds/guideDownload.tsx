import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const code = `// ==UserScript==
// @name            Dota 2 Workshop Guide 1 click subscribe
// @author          popiazaza
// @namespace       popiazaza
// @description     Subscribe all guides from Dota 2 workshop in 1 click
// @version         1.6
// @include         https://steamcommunity.com/id/*/myworkshopfiles/?section=guides*
// @grant           none
// ==/UserScript==
function dota2workshopsubnext(loaded = 0, subscribe = true) {
    if (jQuery(".pagebtn.disabled").length && jQuery(".pagebtn.disabled:first").text() == '>') {
        if (subscribe) {
            ShowAlertDialog('Success!', 'You have subsribed to ' + loaded + ' guides!').done(function () { window.location = '?section=guides'; });
        } else {
            ShowAlertDialog('Success!', 'You have unsubsribed to ' + loaded + ' guides!').done(function () { window.location = '?section=guides'; });
        }
    } else {
        jQuery(".pagebtn").each(function () {
            if (jQuery(this).text() == '>' && jQuery(this).attr('href')) {
                var thislocation = jQuery(this).attr('href').replace(/&d2wg_all=(\d*)/, '');
                thislocation = thislocation.replace(/&d2wg_un=(\d*)/, '');
                if (subscribe) {
                    window.location = thislocation + '&d2wg_all=' + loaded;
                } else {
                    window.location = thislocation + '&d2wg_un=' + loaded;
                }
            }
        });
    }
}
function dota2workshopbackfirst(subscribe = true) {
    thislocation = window.location.href.replace(/&p=(\d*)/, '');
    if (subscribe) {
        window.location = thislocation + '&d2wg_all=' + 999999;
    } else {
        window.location = thislocation + '&d2wg_un=' + 999999;
    }
}
function dota2workshopsubnownuke() {
    //dota2workshopsubnow(999999);
    dota2workshopbackfirst();
}
function dota2workshopunsubnow() {
    dota2workshopsubnow(0, false);
}
function dota2workshopunsubnownuke() {
    //dota2workshopsubnow(999999,false);
    dota2workshopbackfirst(false);
}
function dota2workshopsubnow(d2wg_all = 0, subscribe = true) {
    var guideList = [];
    var subscribedList = [];

    jQuery("script").each(function () {
        var guidematch = jQuery(this).html().match(/SharedFileBindMouseHover\( "(.*?)", true, (.*?) \);/);
        if (guidematch) {
            var guidedetail = JSON.parse(guidematch[2].replace(/(\r\n|\n|\r)/gm, ""));
            guideList.push(guidedetail.id);
            subscribedList[guidedetail.id] = guidedetail.user_subscribed;
        }
    });

    var i = 0,
        loaded = 0,
        package = 0,
        total = guideList.length,
        modal = ShowBlockingWaitDialog('Executing…',
            'Please wait until all requests finish. Ignore all the errors, let it finish.');
    if (d2wg_all && typeof (d2wg_all !== 'number')) {
        console.log('first check ', d2wg_all, typeof (d2wg_all))
        d2wg_all = 999999
    }
    console.log(total, d2wg_all)
    for (; i < total; i++) {
        guideid = guideList[i];
        //function below doesn't work because steam doesn't support it yet
        //if( subscribedList[ guideid ] )
        //{
        //	loaded++;
        //	continue;
        //}

        if (subscribe) {
            var subscribeurl = '//steamcommunity.com/sharedfiles/subscribe';
        } else {
            var subscribeurl = '//steamcommunity.com/sharedfiles/unsubscribe';
        }

        jQuery.post(subscribeurl,
            {
                appid: 570,
                id: guideid,
                sessionid: g_sessionID
            }
        ).always(function () {
            loaded++;

            modal.Dismiss();

            if (loaded >= total) {
                console.log(d2wg_all)
                if (d2wg_all) {
                    if (d2wg_all !== 999999) {
                        loaded = d2wg_all + loaded;
                    }
                    if (subscribe) {
                        dota2workshopsubnext(loaded);
                    } else {
                        dota2workshopsubnext(loaded, false);
                    }
                } else {
                    if (subscribe) {
                        ShowAlertDialog('Success!', 'You have subsribed to ' + loaded + ' guides!').done(function () { location.reload(); });
                    } else {
                        ShowAlertDialog('Success!', 'You have unsubsribed to ' + loaded + ' guides!').done(function () { location.reload(); });
                    }
                }
            }
            else {
                modal = ShowBlockingWaitDialog('Executing…',
                    'Loaded <b>' + loaded + '</b>/' + total + '.');
            }
        }
        );
    }
}

(function () {
    if (location.search.split('d2wg_all=')[1]) {
        dota2workshopsubnow(parseInt(location.search.split('d2wg_all=')[1]));
    } else if (location.search.split('d2wg_un=')[1]) {
        dota2workshopsubnow(parseInt(location.search.split('d2wg_un=')[1]), false);
    }
    jQuery('.followStatsBlock').append('<a href="javascript:void(0);" id="dota2workshopsuball" class="btn_darkblue_white_innerfade btn_medium"><span>Subscribe all on this page</span></a>');
    document.getElementById('dota2workshopsuball').addEventListener('click', dota2workshopsubnow, false);
    jQuery('.followStatsBlock').append('<br><br><a href="javascript:void(0);" id="dota2workshopsuballnuke" class="btn_darkblue_white_innerfade btn_medium"><span>Subscribe all from this person</span></a>');
    document.getElementById('dota2workshopsuballnuke').addEventListener('click', dota2workshopsubnownuke, false);
    jQuery('.followStatsBlock').append('<br><br><a href="javascript:void(0);" id="dota2workshopunsuball" class="btn_darkblue_white_innerfade btn_medium"><span>Unsubscribe all on this page</span></a>');
    document.getElementById('dota2workshopunsuball').addEventListener('click', dota2workshopunsubnow, false);
    jQuery('.followStatsBlock').append('<br><br><a href="javascript:void(0);" id="dota2workshopunsuballnuke" class="btn_darkblue_white_innerfade btn_medium"><span>Unsubscribe all from this person</span></a>');
    document.getElementById('dota2workshopunsuballnuke').addEventListener('click', dota2workshopunsubnownuke, false);
}()); `
const GuideGuide = () => {
    const tamperMonkeyLink = 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo'
    // const [codeText, setCodeText] = useState('')
    // const updateCodeText = async () => {
    //     const t = (await fetch('tamperCode.txt')).text()
    //     const text = await t
    //     setCodeText(text)
    //     console.log(text)
    // }
    // updateCodeText()
    return (
        <div className="" style={{ padding: '10px', zIndex: 999, color: 'white', textTransform: 'capitalize' }}>
            <h4>Step 1:</h4>
            <a target='_blank' rel='noreferrer' href={tamperMonkeyLink}>
                <p>Download Tampermonkey extension</p>
            </a>
            <h4>Step 2</h4>
            <p className="copy-guide-code" onClick={() => navigator.clipboard.writeText(code)}>Copy this code
                <FontAwesomeIcon style={{ marginLeft: '10px' }} className='copy-match-id' icon={faCopy} color='white' />
            </p>
            <h4>Step 3:</h4>
            <p>Open tampermonkey extension
                <br></br>Create new script
                <br></br>Select all the text and replace it with your copied code.
                <br></br>Save the script
            </p>
            <h4>Step 4:</h4>
            <a target='_blank' rel='noreferrer' href='https://steamcommunity.com/id/27bslash/myworkshopfiles/?section=guides'>
                <p>Go to Steam Guide Page</p>
            </a>
        </div >
    )
}
export default GuideGuide