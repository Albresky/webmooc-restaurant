// define buttons's indexes
var kitchen = document.getElementById("Kitchen");
var addCook = document.getElementById("addCook");
var emNewCook = document.getElementById("emNewCook");
var startBtn = document.getElementById("start");
var testGuest = document.getElementById("guest1");
var menuCancel = document.getElementById("menuCancel");
var menuEnter = document.getElementById("menuEnter");
var guestsArea = document.getElementById("guestsArea");
var employEnter = document.getElementById("employEnter");
var employCancel = document.getElementById("employCancel");
var unEmployEnter = document.getElementById("unEmployEnter");
var unEmployCanel = document.getElementById("unEmployCancel");

// initialize global tempVal
var cooksCount = 1;
var guestsCount = 6;
var gameStart = false;


// global timepass
var nowWeek = 1;
var nowDay = 1;

// global Money
var nowMoney = 1000;

// guests
var guests = ["g0", "g1", "g2", "g3", "g4", "g5", "g6"];
var guestNames = ["小王", "小李", "小马", "小张", "小四", "小赵", "小冰"];
var gPool = [];
var gSeatsPool = [];

// z-index
var zIndexMax = 915;

// guest progress lock
var gProgLock = false;

// guest waiting progress timer
var gWaitProgTimer;

// menu food
var foodNames = ["水果沙拉", "浇汁皮蛋豆腐", "肉末粉丝煲", "干锅手撕包菜", "暴走大闸蟹", "蜜汁小龙虾", "糖醋排骨", "玫瑰情人露", "蜂蜜决明茶"];
var foodPrices = [6, 4, 6, 6, 6, 6, 6, 6, 4];
var menuChoices = [
	[],
	[],
	[],
	[]
];

// table index
var tableIndexs = []
var waitProgLock = [false, false, false, false];

// menu table
var menutable = [];
var mainFoodZone = false;

// cook's wage
var cookWage = 100;
var uEPayment;

// cook's id
var cookIds = [];

// cook progress
var cookProgress = [0, 0, 0, 0, 0, 0];
var cookProgLook = [false, false, false, false, false, false];

// document.getElementById("currentMoney").innerText = nowMoney;

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


function getRadGuestId() {
	var gIndex = getRndInteger(0, gPool.length);
	var id = "images/" + gPool[gIndex] + ".png";
	gPool.splice(gIndex, 1);
	return id;
}

function newGuests() {
	var newGuestsTimer = setInterval(function() {
		var guestsCount = countGuests();
		if (guestsCount < 6 && gPool.length != 0) {
			var lastG = (guestsCount != 0) ? lastGuest() : null;
			var gid = getRadGuestId();
			var gArea = document.getElementById("guestsArea");
			var newGuestSpan = document.createElement("span");
			var newGuestBtn = document.createElement("button");
			var newGuestImg = document.createElement("img");
			var newGuestDiv = document.createElement("div");

			newGuestSpan.setAttribute("class", "rM z" + zIndexMax);
			if (guestsCount > 0) {
				spanOfLastGuest = lastG.parentElement.parentElement;
				spanOfLastGuest.setAttribute("class",
					"rOverlay " + spanOfLastGuest.getAttribute("class").split(" ")[1]);
				newGuestSpan.setAttribute("class", "rM z" + zIndexMax);
			}
			zIndexMax -= 1;
			newGuestBtn.setAttribute("class", "guest guestBlue");
			newGuestImg.setAttribute("src", gid);
			newGuestImg.setAttribute("class", "headerIMG");
			newGuestDiv.setAttribute("class", "waitProg");
			newGuestDiv.innerText = "等位中";

			newGuestBtn.appendChild(newGuestImg);
			newGuestBtn.appendChild(newGuestDiv);
			newGuestSpan.appendChild(newGuestBtn);

			gArea.appendChild(newGuestSpan);
			updateGuestProg();
		} else if (guestsCount() == 0 && gPool.length != 0) {
			console.log("today all guests are gone...");
			fadeInOut("splashNoGuest");
			clearInterval(newGuestsTimer);
		}
	}, 10000);
}

function timepass() {
	gPool = guests.concat();
	var secCount = setInterval(function() {
		if (nowDay % 7 == 0) {
			nowWeek += 1;
			nowDay %= 6;
		} else {
			nowDay += 1;

		}
		gPool = guests.concat();
		console.log(nowDay);
		document.getElementById("currentDay").innerText = "D" + nowDay;
		document.getElementById("currentWeek").innerText = "W" + nowWeek;
	}, 80000)
}

function setEleVisbility(ele, flag) {
	var state = document.getElementById(ele);
	if (flag == 1) {
		state.style.display = "block";
	} else {
		state.style.display = "none";
	}
}

function fadeInOut(eleId) {
	var elem = document.getElementById(eleId);
	elem.style = "display:block";
	elem.classList.add("animFadeIn");

	setTimeout(function() {
		elem.classList.remove("animFadeIn");
		elem.classList.add("animFadeOut");
	}, 2000);
	setTimeout(function() {}, 1500);
	setTimeout(function() {
		elem.style = "display:none";
	}, 4000);
}

function countGuests() {
	var ct = 0;
	var G = document.getElementsByClassName("guests")[0];
	if (G != null) {
		ct = G.childElementCount;
	}
	return ct;
}

function letFirstProg() {
	frtG = firstGuest();
	if (frtG.getAttribute("class") != "waitProg waitFirst waitProgGrade") {
		frtG.setAttribute("class", "waitProg waitFirst waitProgGrade");
	}
}

function firstGuest() {
	var g = document.getElementsByClassName("guests")[0].firstElementChild.firstElementChild.children[1];
	return g;
}

function lastGuest() {
	var g = document.getElementsByClassName("guests")[0].lastElementChild.firstElementChild.children[1];
	letFirstProg();
	return g;
}

function removeGuest(g) {
	g.parentElement.parentElement.remove();
	gProgLock = false;
	clearInterval(gWaitProgTimer);
	updateGuestProg();
}

function removeTableG(tableId) {
	var thisT = document.getElementsByName(tableId)[0];
	var thisClass = "noguest ";
	if (tableId == 0) {
		thisClass += "glt"
	} else if (tableId == 1) {
		thisClass += "grt"
	} else if (tableId == 2) {
		thisClass += "blt"
	} else {
		thisClass += "brt"
	}
	thisT.setAttribute("class", thisClass);
	thisT.innerHTML = "";
	var thisProg = document.getElementsByName("prog" + tableId)[0];
	thisProg.innerHTML = "";
	// remove order
	menuChoices[tableId] = [];
}

function updateGuestProg() {
	var progress = 0;
	var nowGuest = (countGuests() != 0) ? firstGuest() : null;
	if (nowGuest != null && !gProgLock) {
		gWaitProgTimer = setInterval(function() {
			if (nowGuest == null) {
				clearInterval(gWaitProgTimer);
				gProgLock = false;
			}
			if (progress >= 100) {
				console.log("guest wait too long, him/her left.");
				fadeInOut("splashGusetLeft");
				removeGuest(nowGuest);
			} else {
				gProgLock = true;
				progress += 1;
				var bgStyle = "background: linear-gradient(to right,#006dd9 0%,#006dd9 " + progress +
					"%,#2693ff " +
					progress +
					"%,#2693ff 100%);"
				nowGuest.style.cssText = bgStyle;
			}
		}, 300);
	} else {
		console.log("no guest is waiting...");
		gProgLock = false;
	}
}

function updateFoodWaitProg(tableiid) {
	var fProgress = 0;
	var curProg = document.getElementsByName("prog" + tableiid)[0];
	fWaitProgWait = setInterval(function() {
		if (curProg == null) {
			clearInterval(fWaitProgWait);
		}
		if (fProgress >= 100) {
			console.log("table${tableiid} wait too long, him/her is angry.");
			fadeInOut("splashFood2Long");
			removeTableG(tableiid);
			clearInterval(fWaitProgWait);

			// } else if (waitProgLock[tableiid]) {
			// 	clearInterval(fWaitProgWait);
		} else {
			for (var i = 0; i < curProg.childElementCount; i++) {
				if (curProg.children[i].getAttribute("value") == "ready") {
					continue;
				}
				var bgStyle = "background: linear-gradient(to right,#b20000 0%,#b20000 " + fProgress +
					"%,#ff2020 " +
					fProgress +
					"%,#ff2020 100%);"
				curProg.children[i].style.cssText = bgStyle;
			}
			fProgress += 1;
		}
	}, 500);
}


function accelCook(cookid) {
	// cookProgLook[cookid] = true;
	console.log(`PreAccelerate cookProgress[${cookid}]=${cookProgress[cookid]}`);
	cookProgress[cookid] += 20;
	console.log(`accelerated cookProgress[${cookid}]=${cookProgress[cookid]}`);
	// cookProgLook[cookid] = false;
}

function isPayful(tableNamee) {
	var thisTable = document.getElementsByName("prog" + tableNamee)[0].children;
	for (var i = 0; i < thisTable.length; i++) {
		if (thisTable[i].getAttribute("value") != "ready") {
			return false;
		}
	}
	return true;
}

function getTableId(progNameOrId) {
	return progNameOrId.split('_')[0][5]
}

function eatingProg(progName) {
	var thisEatProg = document.getElementById(progName);
	var progressss = 0;
	eatTimer = setInterval(function() {
		if (progressss >= 100) {
			var tablllename = getTableId(progName);
			waitProgLock[tablllename] = true;
			thisEatProg.style.cssText = "background-color: #00b200";
			thisEatProg.setAttribute("value", "ready");
			if (isPayful(tablllename)) {
				showPayBtn(tablllename);
			}
			clearInterval(eatTimer);
			return;
		}
		// console.log("cookid:" + cookid);
		var bgStyle =
			`background: linear-gradient(to right, #b20000 0%, #b20000 ${progressss}%, #ff2020 ${progressss}%, #ff2020 100%);`
		thisEatProg.style.cssText = bgStyle;
		progressss += 3;
	}, 100);
}

function freeCook(cookid) {
	var thisCook = document.getElementById("sCook_" + cookid).children[0];
	for (var i = 0; i < thisCook.childElementCount; i++) {
		var child = thisCook.children[i];
		if (child.getAttribute("class") == "unEmploy") {
			child.removeAttribute("style");
		} else if (child.getAttribute("class") == "cWaitProg") {
			child.remove();
		}
	}
	thisCook.setAttribute("class", "cookFree cookFit");
}

// cooking food progress
function cookingProg(progId, tableId, cookid) {
	var curProg = document.getElementById(progId);
	fCookProgWait = setInterval(function() {
		if (curProg == null) {
			cookProgress[cookid - 1] = 0;
			clearInterval(fCookProgWait);
		}
		if (cookProgress[cookid - 1] >= 100) {
			// fadeInOut("splashFood2Long");
			// removeTableG(tableId);
			cookProgress[cookid - 1] = 0;
			eatingProg(curProg.getAttribute("name"));
			clearInterval(fCookProgWait);
			freeCook(cookid);
			// return;
		}
		// } else if (!cookProgLook[cookid - 1]) {
		else {
			// console.log("cookid:" + cookid);
			console.log(`cookProgress[${cookid-1}]=${cookProgress[cookid-1]}`);
			var bgStyle = "background: linear-gradient(to right,#b20000 0%,#b20000 " + cookProgress[cookid -
					1] +
				"%,#ff2020 " +
				cookProgress[cookid - 1] +
				"%,#ff2020 100%);"
			curProg.style.cssText = bgStyle;
			cookProgress[cookid - 1] += 1;
		}
	}, 500);
}

function payMeal(id, tableName) {
	var sum = 0;
	Array.prototype.forEach.call(menuChoices[tableName], function(index) {
		sum += foodPrices[index];
	});
	nowMoney += sum;
	removeTableG(tableName);
	updateMoney();
	// document.getElementById(id).remove();
	document.getElementById("guestname").innerText = guestNames[guests.indexOf(gSeatsPool[0])];
	gSeatsPool.shift();
	document.getElementById("foodMoney").innerText = sum;
	updateMoney();
	fadeInOut("splashPaid");
}

function menuChoice(tableindex) {
	var CBs = document.getElementsByClassName("cb");
	for (var i = 0; i < CBs.length; i += 1) {
		if (CBs[i].checked) {
			menuChoices[tableindex].push(i);
			if (i >= 2 && i <= 6) {
				mainFoodZone = true;
			}
		}
	}
}

// reset menu
function resetMenu() {
	var CBs = document.getElementsByClassName("cb");
	for (var i = 0; i < CBs.length; i += 1) {
		CBs[i].checked = false;
	}
}

// reset menuChoice records
function resetMenuRecords(tableiiid) {

}

function showMenu(headerImg, tableIndex) {
	// show menu
	setEleVisbility("menuContainer", 1);
	setEleVisbility("blackOverlay", 1);

	// set guest's headerImg
	var hImg = document.createElement("img");
	hImg.setAttribute("src", headerImg);
	hImg.setAttribute("class", "headerIMG");
	document.getElementById("menuGHeader").children[0].remove();
	document.getElementById("menuGHeader").appendChild(hImg);

	resetMenu();
	menutable.push(tableIndex);
	tableIndexs.push(tableIndex);
}

function allocSeat(headerImg) {
	// remove guest from waiting area
	console.log("allocate seat...");
	removeGuest(firstGuest());

	// allocate seat
	var tb = document.getElementsByClassName("noguest");
	// if(tb.length==4 || tb.length==2){
	// 	tb[1].setAttribute("class","noguest grtConv");
	// }
	if (tb.length > 0) {
		var theTable = tb[0];
		var tbImg = document.createElement("img");
		theTable.setAttribute("class", "guest guestBlue seat")
		tbImg.setAttribute("src", headerImg);
		tbImg.setAttribute("class", "headerIMG");
		theTable.appendChild(tbImg);
		showMenu(headerImg, theTable.getAttribute("name"));
	} else {
		fadeInOut("splashNoSeats");
	}
}

// single choice
function singleChoice(Name, cbID) {
	var foodCBs = document.getElementsByName(Name);
	Array.prototype.forEach.call(foodCBs, function(eh) {
		eh.checked = false;
	});
	cbID.checked = true;
}

function getHeaderImg() {
	return firstGuest().parentElement.children[0].getAttribute("src");
}

function getGuestId() {
	return firstGuest().parentElement.children[0].getAttribute("src").split("/")[1].split(".")[0];
}



function showPayBtn(tablenaame) {
	var payImg = document.createElement("img");
	payImg.setAttribute("src", "images/payment.png");
	payImg.setAttribute("class", "pay");
	id = "pay" + tablenaame;
	payImg.setAttribute("id", id);
	payImg.setAttribute("onclick", `payMeal('${id}','${tablenaame}')`);
	document.getElementsByName(tablenaame)[0].appendChild(payImg);
}



function countCooks() {
	var ct = 6;
	Array.prototype.forEach.call(document.getElementsByName("acook"), function(c) {
		if (c.parentElement.style.display == "none") {
			ct -= 1;
		}
	});
	return ct;
}

function insertNewCook() {
	var cooksNum = countCooks();
	// create a new cook
	var cookSpan = document.createElement("span");
	var cookBtn = document.createElement("button");
	var cookImg = document.createElement("img");
	var cookedImg = document.createElement("img");
	var unEmpDiv = document.createElement("div");

	cookBtn.setAttribute("class", "cookFree cookFit");
	cookBtn.setAttribute("name", "acook");
	cookImg.setAttribute("class", "headerIMG");
	cookImg.setAttribute("src", "images/cook.png");
	cookedImg.setAttribute("src", "../images/cooked.png");
	cookedImg.setAttribute("class", "cooked");
	cookedImg.setAttribute("style", "display:none");
	unEmpDiv.setAttribute("class", "unEmploy");
	var thisID = "cook" + cooksNum;
	unEmpDiv.setAttribute("id", thisID);
	unEmpDiv.setAttribute("onclick", "unEmployCook(${thisID})");

	cookBtn.appendChild(cookImg);
	cookBtn.appendChild(cookedImg);
	cookBtn.appendChild(unEmpDiv);
	cookSpan.appendChild(cookBtn);


	var f1 = document.getElementById("floor1");
	var f2 = document.getElementById("floor2");
	// insert cook node

	if (cooksNum == 1) {
		f1.insertBefore(cookSpan, addCook.parentElement);
	} else if (cooksNum == 2) {
		f1.insertBefore(cookSpan, addCook.parentElement);
		addCook.style = "display:none";
		document.getElementById("Kitchen").setAttribute("class", "kitchen kitchen2");
		f1.setAttribute("class", "wrapHalf");
		f2.setAttribute("class", "wrapHalf");
		f2.removeAttribute("style");
		emNewCook.style = "display:block";
	} else {
		f2.insertBefore(cookSpan, emNewCook.parentElement);
	}

}

function insertNewCookV2() {
	var cooksNum = countCooks();
	var f1 = document.getElementById("floor1");
	var f2 = document.getElementById("floor2");
	if (cooksNum == 2) {
		addCook.style = "display:none";
		document.getElementById("Kitchen").setAttribute("class", "kitchen kitchen2");
		f1.setAttribute("class", "wrapHalf");
		f2.setAttribute("class", "wrapHalf");
		f2.removeAttribute("style");
		emNewCook.removeAttribute("style");
	} else if (cooksNum == 5) {
		emNewCook.setAttribute("style", "display:none");
	}
	document.getElementById(`sCook_${cooksNum+1}`).removeAttribute("style");
}

function toMoney(num) {
	return num.toString().replace(/\d+/, function(n) {
		return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	});
}

function updateMoney() {
	document.getElementById("currentMoney").innerText = toMoney(nowMoney);
}

updateMoney();

function unEmployCook(cookId) {
	cookIds.push(cookId);
	uEPayment = Math.round((nowDay / 7.0 + 1) * cookWage);
	document.getElementById("unEmployCookFee").innerText = uEPayment;
	setEleVisbility("iUnemployCook", 1);
	setEleVisbility("blackOverlay", 1);
}

function arrangeCook(tableId) {
	var CooksID = "sCook_";
	var foodList = [];
	for (var i = 0; i < menuChoices[tableId].length; i += 1) {
		foodList.push(menuChoices[tableId][i]);
	}
	var arrangeFoodTimer = setInterval(() => {
		for (var j = 1; j <= 6; j += 1) {
			var thisCook = document.getElementById(CooksID + j);
			if (foodList.length == 0) {
				clearInterval(arrangeFoodTimer);
				return;
			}
			if (thisCook.style.display == "none" || thisCook.children[0].getAttribute(
					"class") == "cookBusy cookFit") {
				continue;
			}
			if (j > 1) {
				document.getElementById("cook" + j).setAttribute("style", "display:none");
			}
			var cookProg = document.createElement("div");
			cookProg.setAttribute("class", "cWaitProg");
			cookProg.setAttribute("onclick", `accelCook('${j-1}')`);
			cookProg.setAttribute("id", `cookingProg${j-1}`);
			cookProg.setAttribute("name", `order${tableId}_` +
				foodList[0]);
			// whose meal the cook is cooking
			cookProg.innerHTML = foodNames[foodList[0]];
			thisCook.children[0].appendChild(cookProg);
			cookingProg(`cookingProg${j-1}`, tableId, j);
			thisCook.children[0].setAttribute("class", "cookBusy cookFit");
			foodList.shift();
			break;
		}
	}, 1000);
	// for (var i = 0; i < menuChoices[tableId].length; i += 1) {
	// 	for (var j = 1; j <= 6; j += 1) {
	// 		var thisCook = document.getElementById(CooksID + j);
	// 		if (thisCook.children[0].getAttribute("style") == "display:none" || thisCook.children[0].getAttribute(
	// 				"class") == "cookBusy cookFit") {
	// 			continue;
	// 		}
	// 		if (j > 1) {
	// 			document.getElementById("cook" + j).setAttribute("style", "display:none");
	// 		}
	// 		var cookProg = document.createElement("div");
	// 		cookProg.setAttribute("class", "cWaitProg");
	// 		cookProg.setAttribute("onclick", `accelCook('${j-1}')`);
	// 		cookProg.setAttribute("id", `cookingProg${j-1}`);
	// 		cookProg.setAttribute("name", `order${tableId}_` + menuChoices[tableId][
	// 			i
	// 		]); // whose meal the cook is cooking
	// 		cookProg.innerHTML = foodNames[menuChoices[tableId][i]];
	// 		thisCook.children[0].appendChild(cookProg);
	// 		cookingProg(`cookingProg${j-1}`, tableId, j);
	// 		thisCook.children[0].setAttribute("class", "cookBusy cookFit");
	// 		break;
	// 	}
	// }
}


// game start
startBtn.addEventListener("click", function() {
	updateMoney();
	timepass();
	setEleVisbility("welcomeCover", 0);
	setEleVisbility("blackOverlay", 0);
	gameStart = true;
	newGuests();
});
// menu Enter
menuEnter.addEventListener("click", function() {
	var tableIdx = menutable.pop();
	// tableIndexs.push(tableIdx);
	menuChoice(tableIdx);
	if (!mainFoodZone) {
		return;
	}
	Array.prototype.forEach.call(menuChoices[tableIdx], function(ch) {
		var wProg = document.createElement("div");
		wProg.setAttribute("class", "sWaitProg");
		wProg.setAttribute("id", `order${tableIdx}_` + ch);
		wProg.setAttribute("value", "");
		wProg.innerText = foodNames[ch];
		document.getElementsByName("prog" + tableIdx)[0].appendChild(wProg);
	});
	setEleVisbility("blackOverlay", 0);
	setEleVisbility("menuContainer", 0);

	// cook
	// food waiting Progress flash
	updateFoodWaitProg(tableIdx);
	arrangeCook(tableIdx);
});

// menu cancel
menuCancel.addEventListener("click", function() {
	var tableIdx = tableIndexs.pop();
	var rabbishSeat = document.getElementsByName(tableIdx)[0];
	rabbishSeat.children[0].remove();
	if (tableIdx == "0") {
		rabbishSeat.setAttribute("class", "noguest glt");
	} else if (tableIdx == "1") {
		rabbishSeat.setAttribute("class", "noguest grt");
	} else if (tableIdx == "2") {
		rabbishSeat.setAttribute("class", "noguest glb");
	} else if (tableIdx == "3") {
		rabbishSeat.setAttribute("class", "noguest grb");
	}
	setEleVisbility("blackOverlay", 0);
	setEleVisbility("menuContainer", 0);
});

guestsArea.addEventListener("click", function() {
	if (countGuests() == 0) {
		return;
	} else {
		var headerImg = getHeaderImg();
		gSeatsPool.push(getGuestId());
		allocSeat(headerImg);
	}
});

// add a cook
addCook.addEventListener("click", function() {
	if (countCooks() >= 6) {
		fadeInOut("splashFullCooks");
		return;
	}
	document.getElementById("cookWage").innerText = cookWage;
	setEleVisbility("iemployCook", 1);
	setEleVisbility("blackOverlay", 1);
});

emNewCook.addEventListener("click", function() {
	if (countCooks() >= 6) {
		fadeInOut("splashFullCooks");
		return;
	}
	setEleVisbility("iemployCook", 1);
	setEleVisbility("blackOverlay", 1);
});


employEnter.addEventListener("click", function() {
	insertNewCookV2();
	document.getElementById("cookNummm").innerText = countCooks();
	setEleVisbility("iemployCook", 0);
	setEleVisbility("blackOverlay", 0);
	fadeInOut("splashEmployCookOK");
})

employCancel.addEventListener("click", function() {
	setEleVisbility("iemployCook", 0);
	setEleVisbility("blackOverlay", 0);
});

unEmployEnter.addEventListener("click", function() {
	// Version 1, dynamic operation
	if (nowMoney - uEPayment > 0) {
		nowMoney -= uEPayment;
		updateMoney();
		var cooksNuum = countCooks();
		var removeCK = cookIds.pop();
		if (cooksNuum == 3) {
			document.getElementById("Kitchen").setAttribute("class", "kitchen");
			document.getElementById("floor1").setAttribute("class", "wrapFull");
			document.getElementById("floor2").setAttribute("class", "wraphalf");
			document.getElementById("floor2").setAttribute("style", "display:none");
			document.getElementById("addCook").removeAttribute("style", "display:none");
			document.getElementById("emNewCook").setAttribute("style", "display:none");
		}
		document.getElementById(removeCK).parentElement.parentElement.style = "display:none";
		document.getElementById("unEmployCookFee2").innerText = uEPayment;
		fadeInOut("splashUnEmployCookOk");
	} else {
		cookIds.pop();
		fadeInOut("splashUnEmployCookOops");
	}
	setEleVisbility("iUnemployCook", 0);
	setEleVisbility("blackOverlay", 0);
})

unEmployCanel.addEventListener("click", function() {
	cookIds.pop();
	setEleVisbility("iUnemployCook", 0);
	setEleVisbility("blackOverlay", 0);
});
