/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks(port, tabGroup) {

  browser.tabs.query({ currentWindow: true, hidden: true }).then((tabList) => {
    for (tab of tabList) {
      let tabItem = document.createElement("div");

      let faviconDiv = document.createElement("div");

      let faviconImg = document.createElement("img");
      faviconImg.className = "tab_favicon";
      faviconImg.src = tab.favIconUrl;

      faviconDiv.appendChild(faviconImg);

      tabItem.id = tab.id;
      tabItem.className = "button tab";
      tabItem.textContent += tab.title;

      tabItem.appendChild(faviconDiv);

      let tabItemContainer = document.createElement("div");
      tabItemContainer.className = "item_container";

      tabItemContainer.appendChild(tabItem);

      let tabCloseButton = document.createElement("button");
      tabCloseButton.className = "close";
      tabCloseButton.textContent = "X";

      tabItemContainer.appendChild(tabCloseButton);

      document.getElementById("popup-content").appendChild(tabItemContainer);
    }
  });

  function onMoved(tab) {
    console.log("Moved " + tab.id);
  }

  document.addEventListener("click", handleClick);

  function handleClick(e) {
    function reportError(error) {
      console.error(`Error: ${error}`);
    }

    // Check classes of clicked element to determine
    // next action:

    console.log(e.target);

    let elClasses = e.target.classList;
    if (elClasses.contains("close")) {
        removeTabItem(e.target, reportError);
    } else if (elClasses.contains("tab")) {
        showTab(e.target);
    } else if (elClasses.contains("reset")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(reset)
        .catch(reportError);
    }
  }

  function removeFromTabGroup(tab) {
    let tabIdToRemove = parseInt( tab.id );
    return new Promise( (resolve, reject) =>{
        browser.tabs.query({ currentWindow: true })
        .then((tabList) => {
            for(i=0; i<tabList.length; i++){
                if( tabList[i].id == tabIdToRemove ) {
                    tabGroup.splice( i, 1 );
                    return Promise.resolve();
                }
            }
        })
    } )
  }

  function removeTabItem(tab, reportError) {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(() => {
        document
          .getElementById("popup-content")
          .removeChild(document.getElementById(tab.id));
        removeFromTabGroup(tab).then(
            port.postMessage({newTabGroup: tabGroup})
        );
        
      })
      .catch(reportError);
  }

  function showTab(tab) {
    let tabId = parseInt(tab.id);
    browser.tabs.show(tabId).then(() => {
      browser.tabs
        .update(tabId, {
          active: true,
        })
        .then(() => {
          let moving = browser.tabs.move(tabId, { index: -1 });
          moving.then(onMoved, reportError);
        });
    });
  }
}

let myPort = browser.runtime.connect({name:"my-port"});

myPort.onMessage.addListener(function(m) {
  console.log("From background script: ");
  console.log(m.tabGroup);

  var tabGroup = m.tabGroup;

  listenForClicks(myPort, tabGroup);
});
