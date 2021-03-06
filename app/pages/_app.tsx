import * as React from "react";
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../themes/theme';
import RootStore from "../stores/RootStore";
import {observer, Provider} from "mobx-react";
import {observable} from "mobx";

@observer
class MyApp extends App {
    rootStore: RootStore;

    constructor(props: any, context: any) {
        super(props, context);

        const isServer = !process.browser;
        this.rootStore = RootStore.getInstance(isServer)
    }

    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            // @ts-ignore
            jssStyles.parentNode.removeChild(jssStyles);
        }

        if ('serviceWorker' in navigator) {
            console.log(navigator.onLine)

            window.addEventListener('load',  () => {
                navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(function (registration) {
                    console.log('SW registered: ', registration)
                }).catch(function (registrationError) {
                    console.log('SW registration failed: ', registrationError)
                })
            });

            window.addEventListener('online', () => {

            });

            window.addEventListener('offline', () => {
                alert('Não há conexão com a internet!')
            });
        }
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head>
                    <title>My page</title>
                </Head>
                <Provider {...this.rootStore.getstores()}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
                </Provider>
            </Container>
        );
    }
}

export default MyApp;
