import { saveTabsToStorage, loadTabsFromStorage } from './utils/storage';

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
    tabCloseButton.textContent = "X";

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
    if( elClasses.contains( "close" ) ) {
      removeTabItem( eTmp.parentElement, reportError );

      await removeFromTabGroup( eTmp.parentElement.id.slice( 10 ) );
      
    } else if( elClasses.contains( "tab" ) ) {
      showTab( eTmp );
    } else if( elClasses.contains( "reset" ) ) {
      browser.tabs
        .query( { active: true, currentWindow: true } )
        .then( reset )
        .catch( reportError );
    }
  }

  async function removeFromTabGroup( tabId ) {
    let tabIdToRemove = parseInt( tabId );
    console.log(tabIdToRemove);
    for( let i = tabGroup.length-1; i >= 0; i-- ) {
      if( tabGroup[ i ].id == tabIdToRemove ) {
        console.log(tabGroup);
        tabGroup.splice( i, 1 );
        console.log(tabGroup);
        break;
      }
    }
    await saveTabsToStorage( tabGroup );
  }

  function removeTabItem( tabContainer, reportError ) {
    document.getElementById( "popup-content" )
      .removeChild( document.getElementById( tabContainer.id ) );
  }

  async function getTabById( id ) {
    for( tab of tabGroup ) {
      if( tab.id == id ) {
        return tab;
      }
    }
  }

  function showTab( tab ) {
    let tabId = parseInt( tab.id );
    browser.tabs.show( tabId ).then( () => {
      browser.tabs
        .update( tabId, {
          active: true,
        } )
        .then( () => {
          let moving = browser.tabs.move( tabId, { index: -1 } );
          moving.then( onMoved, reportError );
        } );
    } );
  }
}

listenForClicks();
