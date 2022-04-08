import {saveTabsToStorage, loadTabsFromStorage} from './utils/storage';

browser.contextMenus.create( {
  id: "group-tab",
  title: "Group tab",
  contexts: [ "tab" ]
} );

var tabGroup;

browser.contextMenus.onClicked.addListener( function( info, tab ) {
  switch( info.menuItemId ) {
    case "group-tab":
      console.log( "Clicked" );
      addToTabGroup( tab );
  }
} );



function onHidden() {
  console.log( `Hidden` );
}

function onShown() {
  console.log( `Shown` );
}

function onError( error ) {
  console.log( `Error: ${error}` );
}

function onCreated( tab ) {
  tab_group_id = tab.id;
}

async function addToTabGroup( tab ) {
  /*   if( tabGroup.length == 0 ){
      let newTabCreate = browser.tabs.create({
        active: false,
        index: 0,
        pinned: true
      })
      newTabCreate.then( onCreated, onError );
      browser.tabs.onActivated.addListener( tabGroupContextMenu );
    } */
  try{
    tabGroup = await loadTabsFromStorage();
  } catch(e){
    console.log(e);
    tabGroup = [];
  }
  
  tabGroup.push( tab );
  browser.tabs.hide( tab.id ).then( onHidden, onError );
  await saveTabsToStorage( tabGroup );
}

let myPort;

async function connected( p ) {
  console.log("asdasd")
  myPort = p;
  myPort.postMessage( { greeting: "hi there content script!" } );
  myPort.onMessage.addListener( async function( m ) {
    if( m.newTabGroup ) {
      console.log( "Received adjusted tab group from content script..." );
      tabGroup = m.newTabGroup;
      saveTabsToStorage( tabGroup );
    } else {
      tabGroup = await loadTabsFromStorage();
      myPort.postMessage( { tabGroup: tabGroup } );
    }
  } );
}

browser.runtime.onConnect.addListener( connected );

try {
  console.log( "browser : " );
  console.log( browser );
  console.log( "browser.tabs : " );
  console.log( browser.tabs );


} catch( err ) {
  console.log( "err : ", err );
}
