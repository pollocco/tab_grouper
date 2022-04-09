import { saveTabsToStorage, loadTabsFromStorage, saveFlipperTabId, loadFlipperTabId } from './utils/storage';

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
async function listenForClicks() {
  var tabGroup = await loadTabsFromStorage();
  for( let tab of tabGroup ) {
    let tabItem = document.createElement( "div" );

    let faviconDiv = document.createElement( "div" );

    let faviconImg = document.createElement( "img" );
    faviconImg.className = "tab_favicon";
    faviconImg.src = tab.favIconUrl;

    faviconDiv.appendChild( faviconImg );

    tabItem.id = tab.id;
    tabItem.className = "button tab";
    tabItem.textContent += tab.title;

    tabItem.appendChild( faviconDiv );

    let tabItemContainer = document.createElement( "div" );
    tabItemContainer.className = "item_container";

    tabItemContainer.appendChild( tabItem );
    tabItemContainer.id = `container-${tab.id}`;

    let tabCloseButton = document.createElement( "button" );
    tabCloseButton.className = "close";
    tabCloseButton.textContent = "❌";

    tabItemContainer.appendChild( tabCloseButton );

    document.getElementById( "popup-content" ).appendChild( tabItemContainer );
  }

  function onMoved( tab ) {
    console.log( "Moved " + tab.id );
  }

  document.addEventListener( "click", handleClick );

  async function handleClick( e ) {
    function reportError( error ) {
      console.error( `Error: ${error}` );
    }

    // Check classes of clicked element to determine
    // next action:

    let elClasses = e.target.classList;
    let eTmp = e.target;

    if( elClasses.contains( "close" ) 
          ||  elClasses.contains( "tab" ) 
          || elClasses.contains( "open-tab" )  ){
      var clickedTabId = eTmp.parentElement.id.slice( 10 )
    }

    if( elClasses.contains( "close" ) ) {
      removeTabItem( eTmp.parentElement, reportError );
      await removeFromTabGroup( clickedTabId );
      await browser.tabs.remove( clickedTabId );
    } 
    
    else if( elClasses.contains( "tab" ) || elClasses.contains( "open-tab" ) ) {
      try {
        var id = await loadFlipperTabId();
        if( id ) {
          showTab( clickedTabId, id );
        } 
      } catch( e ) {
        console.log( e );
        openNewFlipperTab( clickedTabId ).then(async()=>{
          id = await loadFlipperTabId();
          showTab(clickedTabId, id)
        });
      }
    } 
    
    else if( elClasses.contains( "reset" ) ) {
      browser.tabs
        .query( { active: true, currentWindow: true } )
        .then( reset )
        .catch( reportError );
    }
  }

  async function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
    await saveFlipperTabId(tab.id);

  }
  
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  function openNewFlipperTab( openingTabId ) {
    let tab = getTabById(openingTabId);
    let url = tab.url;
    let creating = browser.tabs.create({
      url,
      index: 0,
      active: true,
      pinned: true
    });
    creating.then(onCreated, onError);
  }

  async function removeFromTabGroup( tabId ) {
    let tabIdToRemove = parseInt( tabId );
    console.log( tabIdToRemove );
    for( let i = tabGroup.length - 1; i >= 0; i-- ) {
      if( tabGroup[ i ].id == tabIdToRemove ) {
        console.log( tabGroup );
        tabGroup.splice( i, 1 );
        console.log( tabGroup );
        break;
      }
    }
    await saveTabsToStorage( tabGroup );
  }

  function removeTabItem( tabContainer, reportError ) {
    document.getElementById( "popup-content" )
      .removeChild( document.getElementById( tabContainer.id ) );
  }

  function getTabById( id ) {
    for( let tab of tabGroup ) {
      if( tab.id == id ) {
        return tab;
      }
    }
  }

  function showTab( tabId, flipperTabId ) {
    if( tabId == flipperTabId ){
      return;
    }
    var groupTab = getTabById( tabId );
    return new Promise((resolve, reject)=>{
      browser.tabs.show( parseInt(tabId) ).then(()=>{
        browser.tabs
        .update( parseInt(tabId), {
          active: true,
          pinned: true,
        } ).then(()=>{
          browser.tabs.update( flipperTabId, {
            pinned: false
          }).then(()=>{
            browser.tabs.hide( flipperTabId )
          }).then(()=>{
            saveFlipperTabId( parseInt(tabId) ).then(()=>{
              return Promise.resolve();
            })
          })
        });
      });
    })

  }
}

listenForClicks();
