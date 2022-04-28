

const client_id = '47d0dbdd5a1c482bb3d24f61d9187df3';
const client_secret = '9f1a840064b74ff9afc974ee1e6f6496';
let access_token='';
const apikey_musixmatch='8bdd15b6f44dc0d9551e41df29b39636';
const api_wiki='https://it.wikipedia.org/w/api.php?'

fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: 'grant_type=client_credentials'
})
.then(onResponse).then(onTokenJson);



function onResponse(response){
    
    return response.json();

}
function getJson(json){



}

function onTokenJson(json){

    access_token=json.access_token;

}

function showSearchbar(event){
let element=event.currentTarget;
searchbar.classList.remove('hide');
element.removeEventListener('click',showSearchbar);
element.addEventListener('click',hideSearchbar);

}

function prova(json){

console.log(json);

}

function attachDescription(json){

sezione_descrione=document.querySelector('#descrizione-artista');
descrione=document.createElement('p');
descrione.innerHTML=json.query.search[0].snippet;
a=document.createElement('a');
link=document.createElement("p");
link.innerHTML='continua ...';
a.href='https://it.wikipedia.org/wiki/' +encodeURIComponent(json.query.search[0].title);
a.appendChild(link);
descrione.appendChild(a);
sezione_descrione.appendChild(descrione);



}

function searchSnippet(json){

title=json.query.search[0].title;
request = 	'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&titles='+encodeURIComponent(title);
             fetch(request,{
                method: "GET",            
        
              }).then(onResponse).then(prova);

}


function searchArtistDescription(id){

    request = 	api_wiki +'action=query&origin=*&list=search&srsearch=' + encodeURIComponent(id)+"&utf8=&format=json";
             const  json=fetch(request,{
                method: "GET",            
        
              }).then(onResponse).then(attachDescription);
}


// function searchTrackMusixmatch(id){

//     request =   'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/v1.1/track.get?track_isrc=' + id +'&apikey='+ apikey_musixmatch;
//     console.log(request);
//                fetch(request,{
//                 method: "GET",
        
//               }).then(onResponse).then(prova);

// }


function descriptionSong(json){

   blocco_descrizione= document.querySelector('#descrizione_canzone');
   testo=document.createElement('p');
   if (json.response.song.description.plain==='?'){

    testo.innerHTML='Nessuna descrizione disponibile';
   }
   else {
    testo.innerHTML=json.response.song.description.plain;}
   blocco_descrizione.appendChild(testo);




}


function searchDescriptionGenius(json){

id=json.response.hits[0].result.id;
{lyric_request = 'https://cors-anywhere.herokuapp.com/https://api.genius.com/songs/'+ id +'?text_format=plain';
    fetch(lyric_request,{
        method:'GET',
    headers: {
   'Authorization':'Bearer ' + access_token_genius,
   'Content-Type': 'application/json',
   'Access-Control-Allow-Origin':'*'
         }    

        }).then(onResponse).then(descriptionSong);


    }

}

function searchSongGenius(canzone,artista){


    {song_request = 'https://cors-anywhere.herokuapp.com/https://api.genius.com/search?q=' +encodeURIComponent(canzone) +'%20'+ encodeURIComponent(artista);
    fetch(song_request,{
    headers: {
   'Authorization':'Bearer ' + access_token_genius,
   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
   'Access-Control-Allow-Origin':'*'     }    

        }).then(onResponse).then(searchDescriptionGenius);
    }

   
}

function showResultSong(json){
    sezione_risultati.style.display='none';
    sezione_canzone=document.querySelector('#show-content');
    sezione_canzone.style.display='flex';
    blocco_int=document.createElement('div');
    blocco_int.setAttribute("id",'canzone');
    blocco_int.classList.add('show-content');
    immagine=document.createElement('img');
    if (json.album.images.length !== 0){
        immagine.src=json.album.images[0].url;}
        else{
         immagine.src='https://static.thenounproject.com/png/3674270-200.png'
        }
    blocco_immagine=document.createElement('div');
    blocco_testo=document.createElement('div');
    blocco_testo.classList.add('showcontent_text');
    blocco_titolo=document.createElement('div');
    blocco_artista=document.createElement('div');
    titolo=document.createElement('p');
    titolo.innerHTML=json.name;
    
    artista=document.createElement('p');
    artista.innerHTML=json.artists[0].name;
    sezione_canzone.appendChild(blocco_int);
    blocco_int.appendChild(blocco_immagine);
    blocco_immagine.appendChild(immagine);
    blocco_int.appendChild(blocco_testo);
    blocco_testo.appendChild(titolo);
    blocco_testo.appendChild(artista);
    blocco_descrizione=document.createElement('div');
    blocco_descrizione.setAttribute("id","descrizione_canzone");
    sezione_canzone.appendChild(blocco_descrizione);
    searchSongGenius(json.name,json.artists[0].name);

}


function showResultArtist(json){
    
    sezione_risultati.style.display='none';
    contenuti.innerHTML='';
    sezione_canzone=document.querySelector('#show-content');
    sezione_canzone.style.display='flex';
    blocco_int=document.createElement('div');
    blocco_int.setAttribute("id","intestazione-artista");
    blocco_int.classList.add('show-content');
    immagine=document.createElement('img');
    immagine.src=json.images[0].url;
    blocco_immagine=document.createElement('div');
    blocco_immagine.setAttribute("id","sezione-immagine");
    blocco_testo=document.createElement('div');
    blocco_testo.setAttribute("id","descrizione-artista");
    blocco_artista=document.createElement('div');
    
    artista=document.createElement('p');
    artista.innerHTML=json.name;
    sezione_canzone.appendChild(blocco_int);
    blocco_int.appendChild(blocco_immagine);
    blocco_immagine.appendChild(immagine);
    blocco_immagine.appendChild(artista);
    blocco_int.appendChild(blocco_testo);   
    searchArtistDescription(json.name + ' cantante');    

}

function showSong(event){

element=event.currentTarget;

song_request = 	'https://api.spotify.com/v1/tracks/' + element.dataset.id;
             const  json=fetch(song_request,{
                    headers: {
                       'Authorization':'Bearer ' + access_token
                             }    
        
              }).then(onResponse).then(showResultSong);
                    

// console.log(json);
// sezione_canzone=document.querySelector('#show-content');
// blocco_int=document.createElement('div');
// immagine=document.createElement('img');
// blocco_immagine=document.createElement('div');
// blocco_testo=document.createElement('div');
// blocco_titolo=document.createElement('div');
// blocco_artista=document.createElement('div');
// titolo=document.createElement('p');
// titolo.innerHTML=json.name;
// console.log(json.name)
// artista=document.createElement('p');
// artista.innerHTML=element.artists[0].name;
// sezione_canzone.appendChild(blocco_int);
// blocco_int.appendChild(blocco_immagine);
// blocco_int.appendChild(blocco_testo);
// blocco_testo.appendChild(titolo);
// blocco_testo.appendChild(artista);
// blocco_lyrics=document.createElement('div');
}


function showTopTracksForArtist(json){
    
    sezione_artista=document.querySelector('#show-content');  
    blocco_toptracks=document.createElement('div');
    blocco_toptracks.setAttribute("id","top-tracks");
    sezione_artista.appendChild(blocco_toptracks);    
    sezione_toptracks=document.querySelector('#top-tracks');  
    
    top_track=document.createElement('h1');
    top_track.innerHTML='Top Tracks';
    sezione_toptracks.appendChild(top_track);
    for (element of json.tracks){            
    contenitore=document.createElement("div");
    contenitore.setAttribute("id","contenitore");    
    blocco_int=document.createElement('div');
    immagine=document.createElement('img');
    immagine.src=element.album.images[0].url;
    blocco_immagine=document.createElement('div');
    blocco_testo=document.createElement('div');
    blocco_testo.setAttribute("id","testo-top-tracks")
    blocco_titolo=document.createElement('div');
    blocco_album=document.createElement('div');
    titolo=document.createElement('p');
    titolo.innerHTML=element.name;
    album=document.createElement('p');
    album.innerHTML=element.album.name;
    contenitore.appendChild(blocco_int);
    blocco_int.appendChild(blocco_immagine);
    blocco_immagine.appendChild(immagine);
    blocco_int.appendChild(blocco_testo);
    blocco_testo.appendChild(titolo);
    blocco_testo.appendChild(album);
    sezione_toptracks.appendChild(blocco_int);}
}

function showArtist(event){

    element=event.currentTarget;
    
    artist_request = 	'https://api.spotify.com/v1/artists/' + element.dataset.id;
                 fetch(artist_request,{
                    method: 'GET',
                        headers: {
                           'Authorization':'Bearer ' + access_token,
                           'Content-Type' : 'application/json'
                                 }    
            
                  }).then(onResponse).then(showResultArtist);
    
    
                
                artist_request = 	'https://api.spotify.com/v1/artists/' + element.dataset.id+'/top-tracks?country=it';
                 fetch(artist_request,{
                    method: 'GET',
                        headers: {
                           'Authorization':'Bearer ' + access_token,
                           'Content-Type' : 'application/json'
                                 }    
            
                  }).then(onResponse).then(showTopTracksForArtist);
    
                
                }


                



function hideSearchbar(event){
    let element=event.currentTarget;
    searchbar.classList.add('hide');
    element.removeEventListener('click',hideSearchbar);
    element.addEventListener('click',showSearchbar);
    
     
    }

    function onJsonAlbum(json){
        sezione_risultati.innerHTML='';
        let risultati=json.albums.items;
        let pagine= parseInt(json.albums.total / json.albums.limit);    
        album=document.querySelector('#Testo').value
        for(let i=0;i<=pagine;i++){album_request = search_api + 'q='  + album + '&type=album&limit=50'+'&offset='+i*50;
        fetch(album_request,{
        headers: {
       'Authorization':'Bearer ' + access_token
             }    
    
            }).then(onResponse).then(searchAlbum)
        }
    }

function onJsonSong(json){
sezione_risultati.innerHTML='';
let pagine= parseInt(json.tracks.total / json.tracks.limit);    
song=document.querySelector('#Testo').value;

for(let i=0;i<=pagine;i++){song_request = search_api + 'q='  + song + '&type=track&limit=50'+'&offset='+i*50;
        fetch(song_request,{
        headers: {
       'Authorization':'Bearer ' + access_token
             }    
    
            }).then(onResponse).then(searchSong);
            
        }}

function searchSong(json){
    for(let element of json.tracks.items){ 
    blocco=document.createElement('div');
    id=blocco.dataset.id=element.id;
    ex_id=blocco.dataset.ex_id=element.external_ids.isrc;
    immagine=document.createElement('img');   
    if (element.album.images.length !== 0){
        immagine.src=element.album.images[0].url;;}
        else{
         immagine.src='https://static.thenounproject.com/png/3674270-200.png'
        }
    titolo=document.createElement('p');
    titolo.innerHTML=element.name;
    artista=document.createElement('p');
    artista.innerHTML=element.artists[0].name;
    sezione_risultati.appendChild(blocco);
    blocco.appendChild(immagine);
    blocco.appendChild(titolo);
    blocco.appendChild(artista);
    blocco.addEventListener('click',showSong);
    }    
    sezione_risultati.style.display = "flex";
    


}


function onJsonArtists(json){
sezione_risultati.innerHTML='';
let pagine =parseInt(json.artists.total / json.artists.limit);
artist=document.querySelector('#Testo').value
for(let i=0;i<=pagine;i++){artist_request = search_api + 'q='  + artist + '&type=artist&limit=50'+'&offset='+i*50;
        fetch(artist_request,{
        headers: {
       'Authorization':'Bearer ' + access_token
             }    
    
            }).then(onResponse).then(searchArtist);
            
        }

}
//  for(let i=1;i<pagine;i++){
//      const content = document.querySelector('#Testo').value;
//     const text = encodeURIComponent(content);
//      artist_request = search_api + 'q='  + text + '&type=artist'+ '&offset='+pagine*20;
//                 fetch(artist_request,{
//                     headers: {
//                         'Authorization':'Bearer ' + access_token
//                               }    
        
//                }).then(onResponse).then(onJsonArtists)

//  }



function searchArtist(json){    
    
for(let element of json.artists.items){ 
    blocco=document.createElement('div');
    id=blocco.dataset.id=element.id;
    immagine=document.createElement('img');
    if (element.images.length !== 0){
        immagine.src=element.images[0].url;}
        else{
         immagine.src='https://static.thenounproject.com/png/3674270-200.png'
        }
    artista=document.createElement('p');
    artista.innerHTML=element.name;
    sezione_risultati.appendChild(blocco);
    blocco.appendChild(immagine);
    blocco.appendChild(artista);
    sezione_risultati.style.display = "flex";
    blocco.addEventListener('click',showArtist);



}

}


function showResultAlbum(json){    
    sezione_risultati.style.display='none';
    sezione_album=document.querySelector('#show-content');
    sezione_album.style.display='flex';
    blocco_int=document.createElement('div');
    blocco_int.setAttribute('id','blocco_int');
    immagine=document.createElement('img');
    immagine.src=json.images[0].url;
    blocco_immagine=document.createElement('div');
    blocco_testo=document.createElement('div');
    blocco_testo.classList.add('showcontent_text');
    blocco_titolo=document.createElement('div');
    blocco_artista=document.createElement('div');
    titolo=document.createElement('p');
    titolo.innerHTML=json.name;
    titolo.setAttribute("id",'album');
    artista=document.createElement('p');
    artista.setAttribute("id",'artista');
    artista.innerHTML=json.artists[0].name;
    sezione_album.appendChild(blocco_int);
    blocco_int.appendChild(blocco_immagine);
    blocco_immagine.appendChild(immagine);
    blocco_int.appendChild(blocco_testo);
    blocco_testo.appendChild(titolo);
    blocco_testo.appendChild(artista);
    sezione_album=document.querySelector('#show-content');  
    blocco_tracks=document.createElement('div');
    blocco_tracks.setAttribute("id","top-tracks");    
    track=document.createElement('h2');
    track.setAttribute("id","titolo-sezione");
    track.innerHTML='Tracks';
    sezione_album.appendChild(track);
    sezione_album.appendChild(blocco_tracks);    
    sezione_tracks=document.querySelector('#top-tracks');  
    for (element of json.tracks.items){            
    contenitore=document.createElement("div");
    contenitore.setAttribute("id","contenitore");    
    blocco_int=document.createElement('div');
    immagine=document.createElement('img');
    immagine.src=json.images[0].url;
    blocco_immagine=document.createElement('div');
    blocco_testo=document.createElement('div');
    blocco_testo.setAttribute("id","testo-tracks")
    blocco_titolo=document.createElement('div');
    blocco_album=document.createElement('div');
    titolo=document.createElement('p');
    titolo.innerHTML=element.name;
    contenitore.appendChild(blocco_int);
    blocco_int.appendChild(blocco_immagine);
    blocco_immagine.appendChild(immagine);
    blocco_int.appendChild(blocco_testo);
    blocco_testo.appendChild(titolo);
    sezione_tracks.appendChild(blocco_int);}




}

function showAlbum(event){
    
element=event.currentTarget;

album_request = 	'https://api.spotify.com/v1/albums/' + element.dataset.id+'?country=it';
             fetch(album_request,{
                    headers: {
                       'Authorization':'Bearer ' + access_token
                             }    
        
              }).then(onResponse).then(showResultAlbum);

}

function searchAlbum(json){
    let risultati=json.albums.items;
    for(let element of risultati){ 
        if(element.album_type !== 'single'){
    blocco=document.createElement('div');
    id=blocco.dataset.id=element.id;
    immagine=document.createElement('img');    
    if (element.images.length !== 0){
        immagine.src=element.images[0].url;}
        else{
         immagine.src='https://static.thenounproject.com/png/3674270-200.png'
        }
    titolo=document.createElement('p');
    titolo.innerHTML=element.name;
    artista=document.createElement('p');
    artista.innerHTML=element.artists[0].name;
    sezione_risultati.appendChild(blocco);
    blocco.appendChild(immagine);
    blocco.appendChild(titolo);
    blocco.appendChild(artista);}
    sezione_risultati.style.display = "flex";
    blocco.addEventListener('click',showAlbum)
        }
    }




function onJsonAlbum(json){
    sezione_risultati.innerHTML='';
    let risultati=json.albums.items;
    let pagine= parseInt(json.albums.total / json.albums.limit);    
    album=document.querySelector('#Testo').value
    for(let i=0;i<=pagine;i++){album_request = search_api + 'q='  + album + '&type=album&limit=50'+'&offset='+i*50;
    fetch(album_request,{
    headers: {
   'Authorization':'Bearer ' + access_token
         }    

        }).then(onResponse).then(searchAlbum)
    }
    //  for(let i=1;i<pagine;i++){
    //      const content = document.querySelector('#Testo').value;
    //     const text = encodeURIComponent(content);
    //      artist_request = search_api + 'q='  + text + '&type=artist'+ '&offset='+pagine*20;
    //                 fetch(artist_request,{
    //                     headers: {
    //                         'Authorization':'Bearer ' + access_token
    //                               }    
            
    //                }).then(onResponse).then(onJsonArtists)
    
    //  }
}



function closeShowContent(event){

if(event.currentTarget === contenuti || event.key==="Escape"){

    contenuti.style.display='none';
    contenuti.innerHTML='';

} 
}


function closeSearchView(event){

if(event.currentTarget!== sezione_risultati){

    sezione_risultati.style.display='none';


}



}


function closeResult(event){

    if(event.key==='Escape'){

    contenuti.style.display = "none";
sezione_risultati.style.display = "none";
sezione_risultati.innerHTML='';
    }
}





    function search(event){
           
                event.preventDefault();        
        const content = document.querySelector('#Testo').value;        
        if(content) {
            const text = encodeURIComponent(content);
            console.log('Eseguo ricerca elementi riguardanti: ' + text);
            const tipo = document.querySelector('#scelte').value;
            console.log('Ricerco elementi di tipo: ' +tipo);
                 if(tipo === "Song") {
                song_request = search_api + 'q='  + text + '&type=track&limit=1';
                fetch(song_request,{
                    headers: {
                       'Authorization':'Bearer ' + access_token
                             }    
                }).then(onResponse).then(onJsonSong);}

                else if(tipo === "Artist") {
                artist_request = search_api + 'q='  + text + '&type=artist&limit=1';
                fetch(artist_request,{
                    headers: {
                       'Authorization':'Bearer ' + access_token
                             }    
        
              }).then(onResponse).then(onJsonArtists)}
              else if(tipo === 'Album'){
                 album_request = search_api + 'q='  + text + '&type=album&limit=1';
                fetch(album_request,{
                headers: {
               'Authorization':'Bearer ' + access_token
                     }    

                    }).then(onResponse).then(onJsonAlbum)
                }
    
            } 
            else {
                   alert("Inserisci il testo per cui effettuare la ricerca");
                  }
        }



const lente= document.querySelector("#lente");
lente.addEventListener('click',showSearchbar);
const searchbar=document.querySelector("#barra");
const form = document.querySelector('#searchbar');
form.addEventListener('submit', search);
const search_api='https://api.spotify.com/v1/search?';
const sezione_risultati=document.querySelector('#search-view');
const contenuti=document.querySelector('#show-content');
const access_token_genius='Rj_9hVby3IMqjJOZE8_FLm-5F4zVhX3PNt8qFFS-RfWpGWiuYzh8D8oByIsaVMGy'
document.querySelector('body').addEventListener('keydown',closeResult);
document.querySelector('body').addEventListener('keydown',closeShowContent);
contenuti.addEventListener('click',closeShowContent);