browser.contextMenus.create({
  id: "group-tab",
  title: "Group tab",
  contexts: ["tab"]
})

tab_group = [];
tab_group_id = -1;

browser.contextMenus.onClicked.addListener(function(info, tab){
  switch(info.menuItemId){
    case "group-tab":
      console.log("Clicked");
      addToTabGroup(tab);
  }
})

function onHidden() {
  console.log(`Hidden`);
}

function onShown() {
  console.log(`Shown`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onCreated(tab){
  tab_group_id = tab.id;
}

function addToTabGroup(tab){
/*   if( tab_group.length == 0 ){
    let newTabCreate = browser.tabs.create({
      active: false,
      index: 0,
      pinned: true
    })
    newTabCreate.then( onCreated, onError );
    browser.tabs.onActivated.addListener( tabGroupContextMenu );
  } */
  tab_group.push(tab);
  browser.tabs.hide(tab.id).then(onHidden, onError);
  browser.tabs.query({
    currentWindow: true
  }).then((tabs)=>{
/*     for( tab of tabs ){
      browser.runtime.sendMessage(tab.id, {
        command: "tab_group_update",
        tabGroup: tab_group
      }).catch(onError);
    } */
  })

}

let portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.postMessage({greeting: "hi there content script!"});
  portFromCS.onMessage.addListener(function(m) {
    if( m.remove ){
      for( i=0; i<tab_group.length; i++ ){
        if( tab_group[i].id === parseInt(m.remove) ){
          tab_group.splice(i, 1);
          console.log("removed " + m.remove);
        }
      }
    }
    portFromCS.postMessage({tabGroup: tab_group});
  });
}

browser.runtime.onConnect.addListener(connected);

browser.browserAction.onClicked.addListener(function() {
  portFromCS.postMessage({greeting: "they clicked the button!"});
});

try {
  console.log("browser : ");
  console.log(browser);
  console.log("browser.tabs : ");
  console.log(browser.tabs);


} catch(err) {
  console.log("err : ", err);
}
