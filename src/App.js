import React from 'react';
import { IonApp, IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, IonList, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { folderOpen, apps, sdCard } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import FileList from './components/FileList';
import AppList from './components/AppList';
import StorageStats from './components/StorageStats';

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonMenu contentId="main">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Menu</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem routerLink="/apps">
                  <IonIcon icon={apps} slot="start" />
                  <IonLabel>Aplicativos</IonLabel>
                </IonItem>
                <IonItem routerLink="/files">
                  <IonIcon icon={folderOpen} slot="start" />
                  <IonLabel>Arquivos</IonLabel>
                </IonItem>
                <IonItem routerLink="/sdcard">
                  <IonIcon icon={sdCard} slot="start" />
                  <IonLabel>Cartão SD</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonMenu>

          <IonRouterOutlet id="main">
            <Route exact path="/apps" component={AppList} />
            <Route exact path="/files" component={FileList} />
            <Route exact path="/files/:path" component={FileList} />
            <Route exact path="/sdcard" component={FileList} />
            <Route exact path="/">
              <Redirect to="/files" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
