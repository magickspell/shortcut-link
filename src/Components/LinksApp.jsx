import React, {useState} from "react";
import {useQuery, gql, useMutation} from '@apollo/client';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

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

/*const PUT_SHORT_URL = gql`
    mutation shorten_url($url: String) {
        shorten_url(url: $url) {
            short_url {
                id, url, short_url, clicks
            }
        }
    }
`;*/
const PUT_SHORT_URL = gql`
    mutation shorten_url($url: String @rules(apply: ["string", "max: 2048", "url"]) @eq) {
        shorten_url(url: $url) {
            short_url {
                id, url, short_url, clicks
            }
        }
    }
`;

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: 'http://test-task.profilancegroup-tech.com:6001',
});

export const LinksApp = (props) => {

    const {data, loading, error} = useQuery(GET_URLS,
        {
            variables: {first: 10, page: 1}
        }
    )
    const getUrls = () => {
        if (!loading) {
            console.log(data)
        }
    }
    //getUrls()

    let [myUrl, setMyUrl] = useState('')
    const [newShortcut] = useMutation(PUT_SHORT_URL)
    const getShortcut = () => {
        newShortcut({
            variables: {
                input: {
                    myUrl
                }
            }
        }).then(({data}) => {
            console.log(data)
        })
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
                    <p>Lorem ipsum</p>
                </div>
            </div>

            <div className={"links"}>
                <div className={"links__title"}>
                    <h2>Мои ссылки</h2>
                </div>

                {
                    <div className={"item-link"}>
                        <div className={"item-link__id"}>
                            {1}
                        </div>

                        <div className={"item-link__link"}>
                            {'link'}
                        </div>

                        <div className={"item-link__short"}>
                            {'short'}
                        </div>

                        <div className={"item-link__counter"}>
                            {'counter'}
                        </div>
                    </div>
                }
            </div>

            <div className={"links-list"}>
                <div className={"links-list__title"}>
                    <h2>Список ссылок</h2>
                </div>

                {
                    <>
                        <div className={"item-link"}>
                            <div className={"item-link__id"}>
                                {1}
                            </div>

                            <div className={"item-link__link"}>
                                {'link'}
                            </div>

                            <div className={"item-link__short"}>
                                {'short'}
                            </div>

                            <div className={"item-link__counter"}>
                                {'counter'}
                            </div>
                        </div>
                        <div className={"item-link"}>
                            <div className={"item-link__id"}>
                                {1}
                            </div>

                            <div className={"item-link__link"}>
                                {'link'}
                            </div>

                            <div className={"item-link__short"}>
                                {'short'}
                            </div>

                            <div className={"item-link__counter"}>
                                {'counter'}
                            </div>
                        </div>
                    </>
                }

                <div className={"links-list__pagination"}>
                    {
                        <>
                            <div className={"pagination-item"}>
                                {1}
                            </div>
                            <div className={"pagination-item"}>
                                {2}
                            </div>
                            <div className={"pagination-item"}>
                                {3}
                            </div>
                            <div className={"pagination-item"}>
                                {'...'}
                            </div>
                            <div className={"pagination-item"}>
                                {10}
                            </div>
                        </>
                    }
                </div>
            </div>

        </div>
    )
}