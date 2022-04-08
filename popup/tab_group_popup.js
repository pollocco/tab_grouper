/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  browser.tabs.query({currentWindow: true, hidden: true}).then((tabList)=>{
    for( tab of tabList ){
        let tabItem = document.createElement( "div" );

        let faviconDiv = document.createElement( "div" );

        let faviconImg = document.createElement("img");
        faviconImg.className = "tab_favicon";
        faviconImg.src = tab.favIconUrl;

        faviconDiv.appendChild(faviconImg);

        tabItem.id = tab.id;
        tabItem.className = "button tab";
        tabItem.textContent += tab.title;

        tabItem.appendChild(faviconDiv);

        document.getElementById( "popup-content" ).appendChild(tabItem);
      }
  }

  );

  function onMoved(tab){
    console.log("Moved " + tab.id);
  }

  document.addEventListener("click", (e) => {

    function reportError(error) {
      console.error(`Error: ${error}`);
    }

    if (e.target.classList.contains("tab")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(()=>{
            let tgt = e.target;
            document.getElementById("popup-content")
                .removeChild(document.getElementById(tgt.id));
            browser.tabs.show(parseInt(tgt.id)).then(()=>{
                browser.tabs.update(parseInt(tgt.id), {
                    active: true
                }).then(()=>{
                      let moving = browser.tabs.move(parseInt(tgt.id), {index: -1});
                      moving.then(onMoved, reportError);
                })
            })

        })
        .catch(reportError);
    } else if (e.target.classList.contains("reset")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(reset)
        .catch(reportError);
    }
  });
}


listenForClicks();
