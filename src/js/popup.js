var lib = require('./lib');

document.addEventListener('DOMContentLoaded', function(){
  // check local storage
  chrome.storage.local.get('snapshots', function(storage){
    if(!storage.snapshots){
      // initialize local storage
      chrome.storage.local.set({'snapshots': {
        'hackage': {'name': 'Hackage', 'prim': true},
        'lts': {'name': 'LTS (latest)', 'prim': true},
        'nightly': {'name': 'Nightly (latest)', 'prim': true}
      }}, main);
    }else{
      main();
    }
  });
});

function main(){
  // open a new tab for the result of a query on the snapshot
  var searchButton = document.getElementById('search');
  searchButton.addEventListener('click', openSearchResult);

  // list snapshots
  lib.getSnapshots.then(createRadioButtons);
}

function openSearchResult(){
  var query = document.getElementById('searchForm').query.value;
  var snapshot = document.querySelector('input[name="snapshot"]:checked').value;
  var url;

  if(snapshot === 'hackage'){
    url = 'https://www.haskell.org/hoogle/?hoogle=';
  }else{
    url = 'https://www.stackage.org/' + snapshot + '/hoogle?q=';
  }

  url += query;
  chrome.tabs.create({'url': url});
}


function createRadioButtons(snapshots){
  var snapshotSpanList = document.getElementById('snapshots');
  for(var snapId in snapshots){
    var span = document.createElement('span');
    span.classList.add('snapshot');

    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'snapshot';
    radio.id = snapId;
    radio.value = snapId;

    if(snapId === 'hackage'){
      radio.checked = true;
    }
    span.appendChild(radio);

    var label = document.createElement('label');
    label.htmlFor = snapId;
    label.innerHTML = snapshots[snapId].name;
    span.appendChild(label);

    snapshotSpanList.appendChild(span);
  }
}
