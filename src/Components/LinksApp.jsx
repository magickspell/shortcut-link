import React from "react";

export const LinksApp = () => {

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
                    <input type="text"/>
                    <button>Сократить</button>
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