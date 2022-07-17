import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from '@apollo/client';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

//let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");
//const ws = new WebSocket('ws://test-task.profilancegroup-tech.com');

/*
1. кеширование графкл и пагинация
2. почемуто не подключается сокет
3. почему то не создается ссылка
*/

//window.Pusher = Pusher;
/*window.Echo = new Echo({
    broadcaster: 'pusher',
    //key: 'random123key',
    key: '',
    wsHost: 'test-task.profilancegroup-tech.com',
    //cluster: 'test-task.profilancegroup-tech.com',
    wsPort: 6002,
    disableStats: false,
    encrypted: false,
    forceTLS: false,
});
window.Echo.channel('btti_database_short_urls').listen
('new_click', (e) => {
    console.log(e);
})*/

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
    mutation shorten_url($url: String) {
         shorten_url(url: $url) {
            short_url {
                id, url, short_url, clicks
            }
        }
    }
`;

export const LinksApp = (props) => {

    /*пагинация*/
    let [currentPage, setCurrentPage] = useState(1)
    /*список ссылок*/
    const {data, loading, error, refetch} = useQuery(GET_URLS,
        {
            variables: {first: 10, page: currentPage},
            pollInterval: 500
        }
    )
    console.log(data)
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
                    if (i < currentPage - 1) {
                        if (result.indexOf('...') === -1) {
                            result.push('...')
                        }
                    }
                    if (i >= currentPage - 1) {
                        if (i <= currentPage + 1) {
                            result.push(i)
                        }
                    }
                    if (i > currentPage + 1) {
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
    }, [data])

    /*мои ссылки*/
    let [myLinks, setMyLinks] = useState([])
    let [myUrl, setMyUrl] = useState('')
    const [newShortcut] = useMutation(PUT_SHORT_URL)
    const [shortcutStatus, setShortcutStatus] = useState('')
    const shortenURL = () => {
        console.log(myUrl)
        let resultShow = document.getElementById("resultShow").innerHTML
        console.log('resultShow:', shortcutStatus)
        if (myUrl.indexOf('http') === -1) {
            console.warn(`wron url type: ${myUrl}`)
            setShortcutStatus('Упс, попробуйте повторить попытку позже или исправьте ссылку')
        } else {
            newShortcut({
                variables: {
                    url: myUrl
                }
            }).then(
                ({data, errors}) => {
                    if (errors) {
                        console.warn(errors);
                    } else {
                        console.log(data);
                        //setShortcutStatus(`был создан шоткат номер - ${data.shorten_url.short_url.id}`);
                        setShortcutStatus('')

                        let newArr = myLinks.map(i => i)
                        if (newArr.some(i => i.url === data.shorten_url.short_url.url)) {
                            newArr.map(i => {
                                if (i.url === data.shorten_url.short_url.url) {
                                    i.clicks = data.shorten_url.short_url.clicks
                                }
                            })
                        } else {
                            newArr.push(data.shorten_url.short_url)
                        }
                        setMyLinks(newArr)
                    }
                }
            )
        }
    }
    useEffect((e) => {
        /*if (myUrl.length > 1) {
            //shortenURL(myUrl)
            let newArr = myLinks.map(i => i)
            if (newArr.some((i) => i.url === data.short_urls.data.url)) {
                newArr.map(i => {
                    if (i.url === data.short_urls.data.url) {
                        //i.clicks = data.shorten_url.short_url.clicks
                        i.clicks = data.short_urls.data.clicks
                    }
                })
            }
        }*/
        if (!loading) {
            let newArr = myLinks.map(i => i)
            data.short_urls.data.map((i,n) => {
                if (newArr.some((el, index) => el.url === i.url)) {
                    //el.clicks = i.clicks
                    newArr.map(x => {
                        if (x.url === i.url) {
                            x.clicks = i.clicks
                        }
                    })
                }
            })
        }
    }, [data])



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
                                   setMyUrl(e.currentTarget.value.toString())
                               }}
                    />

                    <button
                        onClick={
                            (e) => {
                                e.preventDefault()
                                shortenURL(myUrl)
                            }}
                    >Сократить
                    </button>
                </div>

                <div className={"form__result"}>
                    <p id={"resultShow"} style={{color: 'red'}}>
                        {shortcutStatus}
                    </p>
                </div>
            </div>

            {/*мои ссылки*/}
            <div className={"links"}>
                <div className={"links__title"}>
                    <h2>Мои ссылки</h2>
                </div>
                {
                    (myLinks.length > 0)
                        ? (

                            myLinks.map((i, n) => {
                                return (
                                    <div className={"item-link"}>
                                        <div className={"item-link__id"} key={"item-link__id" + n}>
                                            {n + 1}
                                        </div>

                                        <div className={"item-link__link"} key={"item-link__link" + n}>
                                            <a href={i.url} target={"_blank"}><p>{i.url}</p></a>
                                        </div>

                                        <div className={"item-link__short"} key={"item-link__short" + n}>
                                            <a href={i.short_url} target={"_blank"}><p>{i.short_url}</p></a>
                                        </div>

                                        <div className={"item-link__counter"} key={"item-link__counter" + n}>
                                            {i.clicks}
                                        </div>
                                    </div>
                                )
                            })
                        )
                        : (<p style={{
                            gridColumnStart: 2,
                            gridColumnEnd: 4,
                            textAlign: 'center',
                            border: '1px solid black',
                            backgroundColor: "lightgray"
                        }}>список пуст</p>)
                }
            </div>

            {/*список всех ссылки*/}
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
                                                <a href={i.url} target={"_blank"}><p>{i.url}</p></a>
                                            </div>

                                            <div className={"item-link__short"}
                                                 key={`item-link__short${i.id}`}>
                                                <a href={i.short_url} target={"_blank"}><p>{i.short_url}</p></a>
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

                {/*пагинация*/}
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