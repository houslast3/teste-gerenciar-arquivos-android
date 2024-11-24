import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonSpinner } from '@ionic/react';
import { apps } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';

const AppList = () => {
  const [appList, setAppList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      // No Android, os apps estão geralmente em /data/app
      const result = await Filesystem.readdir({
        path: '/data/app',
        directory: Directory.ExternalStorage
      });

      setAppList(result.files);
      setLoading(false);
    } catch (error) {
      console.error('Error loading apps:', error);
      setLoading(false);
      // Em caso de erro de permissão, podemos mostrar apps de exemplo
      setAppList([
        { name: 'Exemplo: WhatsApp', size: '45MB' },
        { name: 'Exemplo: Facebook', size: '78MB' },
        { name: 'Exemplo: Instagram', size: '55MB' }
      ]);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Aplicativos Instalados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        ) : (
          <IonList>
            {appList.map((app, index) => (
              <IonItem key={index}>
                <IonIcon icon={apps} slot="start" />
                <IonLabel>
                  <h2>{app.name}</h2>
                  {app.size && <p>{app.size}</p>}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </>
  );
};

export default AppList;
