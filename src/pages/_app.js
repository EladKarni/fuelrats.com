// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { animated } from '@react-spring/web'
import withRedux from 'next-redux-wrapper'
import App from 'next/app'
import NextHead from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'





// Component imports
import PageTransitionContainer from '../components/AppLayout/PageTransitionContainer'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'
import NProgress from '../components/NProgress'
import UserMenu from '../components/UserMenu'
import classNames from '../helpers/classNames'
import * as faIcons from '../helpers/faIconLibrary'
import { resolvePageMeta } from '../helpers/gIPTools'
import frApi from '../services/fuelrats'
import { initStore } from '../store'
import { initUserSession, notifyPageLoading } from '../store/actions/session'
import ErrorPage from './_error'





// Style imports
import '../scss/app.scss'





// Configure and populate FontAweomse library
faConfig.autoAddCss = false
faLibrary.add(faIcons)





@withRedux(initStore)
class FuelRatsApp extends App {
  constructor (props) {
    super(props)

    if (props.accessToken) {
      frApi.defaults.headers.common.Authorization = `Bearer ${props.accessToken}`
    }
  }


  static async getInitialProps (appCtx) {
    const { Component, ctx } = appCtx

    await ctx.store.dispatch(initUserSession(ctx))

    const initialProps = {
      accessToken: ctx.accessToken,
      pageProps: {
        asPath: ctx.asPath,
        query: ctx.query,
        ...((await Component.getInitialProps?.(ctx)) ?? {}),
      },
    }

    if (ctx.err) {
      initialProps.err = { ...ctx.err }
      initialProps.pageProps = (await ErrorPage.getInitialProps?.(ctx)) ?? {}
      initialProps.pageMeta = await resolvePageMeta(ErrorPage, ctx, initialProps.pageProps)
    } else {
      initialProps.pageMeta = await resolvePageMeta(Component, ctx, initialProps.pageProps)
    }

    await ctx.store.dispatch(notifyPageLoading(appCtx))

    return initialProps
  }

  renderPage = ({ item, key, props }) => {
    const { Page, pageProps, pageMeta } = item

    const {
      title,
      displayTitle,
      noHeader,
      noLayout,
    } = pageMeta

    const mainClasses = classNames(
      'page',
      pageMeta.className,
      title.toLowerCase().replace(/\s/gu, '-'),
    )

    return (
      <animated.main key={key} className={mainClasses} style={props}>
        {
          !noHeader && !noLayout && (
            <header className="page-header">
              <h1>
                {displayTitle ?? title}
              </h1>
            </header>
          )
        }
        <Page {...pageProps} />
      </animated.main>
    )
  }

  render () {
    const {
      pageMeta,
      store,
    } = this.props

    return (
      <React.StrictMode>
        <NextHead>
          <title>{`${pageMeta.title} | The Fuel Rats`}</title>
          <meta content={pageMeta.title} property="og:title" />
          <meta content={pageMeta.description} name="description" />
          <meta content={pageMeta.description} property="og:description" />
        </NextHead>
        <div role="application">
          <Provider store={store}>
            {
              !pageMeta.noLayout && (
                <>
                  <NProgress />
                  <Header />
                  <UserMenu />
                </>
              )
            }

            <PageTransitionContainer {...this.pageData}>
              {this.renderPage}
            </PageTransitionContainer>

            <LoginModal />
          </Provider>
        </div>
      </React.StrictMode>
    )
  }


  get pageData () {
    const {
      Component,
      err,
      pageMeta,
      pageProps,
      router,
    } = this.props

    let Page = Component

    if (err) {
      Page = ErrorPage
    }

    return {
      items: { Page, pageProps, pageMeta },
      keys: router.asPath,
    }
  }
}





export default FuelRatsApp
