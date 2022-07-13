import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from '@apollo/client';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import io from 'socket.io-client';

let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");
const ws = new WebSocket('ws://test-task.profilancegroup-tech.com');

/*
1. кеширование графкл
2. почемуто не подключается сокет
3. почему то не создается ссылка
*/

/*window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'key123',
    //cluster: 'test-task.profilancegroup-tech.com',
    wsHost: 'test-task.profilancegroup-tech.com',
    wsPort: 6002,
    forceTLS: false,
    disableStats: true,
    transports: ['websocket'],
    enabledTransports: ['ws', 'wss'] // <- added this param
});
window.Echo.channel('btti_database_short_urls')
    .listen('new_click',(e) => {console.log(e);
    })*/

/*let socket = new WebSocket("ws://test-task.profilancegroup-tech.com:6002");

socket.onopen = function(e) {
    console.log("[open] Соединение установлено");
    console.log("Отправляем данные на сервер");
    socket.send("ok?");
};

socket.onmessage = function(event) {
    console.log(`[message] Данные получены с сервера: ${event.data}`);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        console.log('[close] Соединение прервано');
    }
};

socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};*/


const GET_URLS = gql`
  query short_urls($first: Int, $page: Int) {
      short_urls(first: $first, page: $page) {
        data {
            id, url, short_url, clicks
        }
        paginatorInfo {
            count, currentPage, firstItem, hasMorePages, lastItem, lastPage, perPage, total
        }
      }
   }
`;

const PUT_SHORT_URL = gql`
    mutation shorten_url($url: String @rules(apply: ["string", "max: 2048", "url"]) @eq) {
        shorten_url(url: $url) {
            short_url {
                id, url, short_url, clicks
            }
        }
    }
`;

export const LinksApp = (props) => {

    let [currentPage, setCurrentPage] = useState(1)
    const {data, loading, error} = useQuery(GET_URLS,
        {
            variables: {first: 10, page: currentPage}
        }
    )
    let [pages, setPages] = useState([])
    const pageSetup = (currentPage = 1, firstPage = 1, lastPage = '...', size = 10) => {
        let result = []

        if (!loading) {
            lastPage = data.short_urls.paginatorInfo.lastPage
            result.push(1)

            for (let i = 1; i <= lastPage; i++) {

                if (
                    (i !== 1)
                    &&
                    (i !== lastPage)
                ) {
                    if (i < currentPage-1) {
                        if (result.indexOf('...') === -1) {
                            result.push('...')
                        }
                    }

                    if (i >= currentPage-1) {
                        if (i <= currentPage+1) {
                            result.push(i)
                        }
                    }

                    if (i > currentPage+1) {
                        if (result.slice(2).indexOf('...') === -1) {
                            result.push('...')
                        }
                    }
                }
            }

            result.push(lastPage)
        }

        return result
    }
    useEffect((e) => {
        //e.preventDefault()
        if (!loading) {
            setPages(
                pageSetup(currentPage, 1, '...', 10)
            )
        }
    }, [loading])


    let [myUrl, setMyUrl] = useState('')
    const [newShortcut] = useMutation(PUT_SHORT_URL)
    const [shortcutStatus, setShortcutStatus] = useState('')
    const getShortcut = () => {
        try {
            newShortcut({
                variables: {
                    input: {
                        myUrl
                    }
                }
            }).then(({data}) => {
                console.log(data)
                console.log(error)
                if (error) {
                    console.log(`something wrong ${error}`)
                    throw new Error(`something wrong ${error}`)
                }
            })
        } catch (e) {
            setShortcutStatus('ой, что то пошло не так')
        }
    }

    let [myLinks, setMyLinks] = useState([])

    return (
        <div className={"main-wrapper"}>

            <div className={"title"}>
                <h1>Сокращатель</h1>
            </div>

            <div className={"form"}>
                <div className={"form__title"}>
                    <h2>Введите ссылку</h2>
                </div>

                <div className={"form__input"}>
                    <input type="text"
                           id={"url"}
                           value={myUrl}
                           onChange={
                               (e) => {
                                   setMyUrl(e.currentTarget.value)
                               }}
                    />

                    <button
                        onClick={
                            (e) => {
                                e.preventDefault()
                                getShortcut()
                            }}
                    >Сократить
                    </button>
                </div>

                <div className={"form__result"}>
                    <p>{shortcutStatus}</p>
                </div>
            </div>

            <div className={"links"}>
                <div className={"links__title"}>
                    <h2>Мои ссылки</h2>
                </div>

                <div className={"item-link"}>
                    {
                        (myLinks.length > 0)
                            ? (
                                <>
                                    <div className={"item-link__id"} key={1}>
                                        {1}
                                    </div>

                                    <div className={"item-link__link"}>
                                        {'link'}
                                    </div>

                                    <div className={"item-link__short"}>
                                        {'short'}
                                    </div>

                                    <div className={"item-link__counter"}>
                                        {25}
                                    </div>
                                </>
                            )
                            : (<p style={{gridColumnStart: 2, gridColumnEnd: 4}}>список пуст</p>)

                    }
                </div>
            </div>

            <div className={"links-list"}>
                <div className={"links-list__title"}>
                    <h2>Список ссылок</h2>
                </div>

                {
                    (!loading)
                        ? (
                            <>
                                {data.short_urls.data.map((i, n) => {
                                    return (
                                        <div className={"item-link"} key={`item-link-${i.id}`}>
                                            <div className={"item-link__id"}
                                                 key={`item-link__id${i.id}`}>
                                                {i.id}
                                            </div>

                                            <div className={"item-link__link"}
                                                 key={`item-link__link${i.id}`}>
                                                <p>{i.url}</p>
                                            </div>

                                            <div className={"item-link__short"}
                                                 key={`item-link__short${i.id}`}>
                                                <p>{i.short_url}</p>
                                            </div>

                                            <div className={"item-link__counter"}
                                                 key={`item-link__counter${i.id}`}>
                                                {i.clicks}
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )
                        : <p>loading</p>
                }
                <div className={"links-list__pagination"}>
                    {
                        (!loading)
                            ? (
                                <>
                                    {
                                        pages.map((i, n) => {
                                            return (
                                                <div className={"pagination-item"}
                                                     key={`pagination-item-${n}`}
                                                     onClick={(e) => {
                                                         if (e.currentTarget.innerText !== '...') {
                                                             setCurrentPage(Number(e.currentTarget.innerText.trim()))
                                                         }
                                                     }}
                                                >
                                                    {i}
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            )
                            : (
                                <p>loading</p>
                            )

                    }
                </div>
            </div>

        </div>
    )
}