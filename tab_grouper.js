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
  tab_group.push(tab.id);
  console.log(tab_group);
  browser.tabs.hide(tab.id).then(onHidden, onError);
}

try {
  console.log("browser : ");
  console.log(browser);
  console.log("browser.tabs : ");
  console.log(browser.tabs);


} catch(err) {
  console.log("err : ", err);
}
