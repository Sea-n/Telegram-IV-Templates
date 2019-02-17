// ==UserScript==
// @name         Telegram 2019 IV Script
// @namespace    https://sciuridae.me
// @version      0.2
// @description  The script thar can help you to view top candidates.
// @author       Sciuridae Li
// @match        https://instantview.telegram.org/contest
// @updateURL    https://raw.githubusercontent.com/Sea-n/Telegram-IV-Templates/master/IV-Contest-2019.user.js
// @grant        none
// ==/UserScript==

const TOP_20_CANDIDATES_HTML =
    '<div id="top_20_main_candidate" style="height: 50px; overflow: hidden;margin-bottom: 20px;"><h1 style="cursor:pointer" id="top_20_main_candidate_title">Top 20 Main Candidate  (Click me to show list)</h1><div id="dev_page_content"><div class="list-group-contest"><div class="list-group-contest-header"><div class="contest-item-domain list-group-contest-order domain-order">Candidate</div><div class="contest-item-info has-candidate has-info"><span class="contest-item-cell contest-item-templates">Count</span><span class="contest-item-cell contest-item-candidate"></span></div></div>{{data}}</div></div></div>';
const CANDIDATE_COUNT_HTML =
    '<div class="list-group-contest-item"><div class="contest-item-domain">{{name}}</div><div class="contest-item-info has-candidate has-info"><span class="contest-item-cell contest-item-templates">{{count}}</span><span class="contest-item-cell contest-item-candidate"><span class="contest-item-btns"></span><a></a></span></div></div>';

function stringToElement(str) {
    var div = document.createElement("div");
    div.innerHTML = str.trim();
    return div.firstChild;
}

function hideElement(el) {
    el.style.display = "none";
}

function showElement(el) {
    el.style.display = "";
}

var mainCandidateCountList = (() => {
    var tmp = []
    Array.from(document.getElementsByClassName("contest-item-cell contest-item-candidate"))
        .filter((node) => { return node.getElementsByTagName("a").length >= 2 })
        .map((node) => { return (node.getElementsByTagName("a")[1].innerHTML) })
        .forEach((name) => {
            const CandidateIndex = tmp.findIndex(candidate => { return candidate.name == name });
            if (CandidateIndex == -1) {
                tmp.push({ name, count: 1 });
            } else {
                tmp[CandidateIndex].count++;
            }
        })
    return tmp.sort((a, b) => {
        return b.count - a.count;
    });
})()

// Top 20 main candidates
document.body
    .getElementsByClassName("content")[0]
    .prepend(
        stringToElement(
            TOP_20_CANDIDATES_HTML.replace("{{data}}", (() => {
                var tmp = "";
                mainCandidateCountList.slice(0, 20).forEach(candidate => {
                    tmp += CANDIDATE_COUNT_HTML.replace(
                        "{{name}}",
                        candidate.name
                    ).replace("{{count}}", candidate.count);
                })
                return tmp;
            })())
        )
    );

document.getElementById("top_20_main_candidate_title").onclick = () => {
    var list = document.getElementById("top_20_main_candidate");
    var title = document.getElementById("top_20_main_candidate_title");
    list.style.height = "";
    list.style.marginBottom = "";
    list.style.cursor = "";
    title.innerHTML = "Top 20 Main Candidate";
}
