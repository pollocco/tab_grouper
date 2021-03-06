import {getFileStorage} from 'idb-file-storage/src/idb-file-storage';

export async function saveTabsToStorage( tabs ) {
    const storedTabs = await getFileStorage( { name: "tabs-grouped" } );
    const file = await storedTabs.createMutableFile( "tabs_grouped.json" );
    const fh = file.open( "readwrite" );
    await fh.write( JSON.stringify( tabs ) );
    await fh.close();

    await file.persist();
}

export async function saveFlipperTabId( id ) {
    const storedTabs = await getFileStorage( { name: "tabs-grouped" } );
    const file = await storedTabs.createMutableFile( "flipper_tab.json" );
    const fh = file.open( "readwrite" );
    await fh.write( JSON.stringify( {id: id} ) );
    await fh.close();

    await file.persist();
}

export async function loadFlipperTabId() {
    const storedTabs = await getFileStorage( { name: "tabs-grouped" } );
    var file = await storedTabs.get( 'flipper_tab.json' );
    if( file.open ) {
        const fh = await file.open( "readonly" );
        const metadata = await fh.getMetadata();
        var id = await fh.readAsText(metadata.size);
        id = JSON.parse( id );  
        await fh.close();
        return id.id;
    }

}

export async function loadTabsFromStorage() {
    const storedTabs = await getFileStorage( { name: "tabs-grouped" } );
    var file = await storedTabs.get( 'tabs_grouped.json' );
    if( file.open ) {
        const fh = await file.open( "readonly" );
        const metadata = await fh.getMetadata();
        var tabs = await fh.readAsText(metadata.size);
        tabs = JSON.parse( tabs );  
        await fh.close();
        return tabs;
    }

}