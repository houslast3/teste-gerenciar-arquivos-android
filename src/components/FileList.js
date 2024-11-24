import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonSpinner } from '@ionic/react';
import { folderOpen, document, pieChart } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const FileList = ({ match }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('');
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    loadFiles();
  }, [match.params.path]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const path = match.params.path || '';
      setCurrentPath(path);

      const result = await Filesystem.readdir({
        path: path,
        directory: Directory.ExternalStorage
      });

      const filesWithStats = await Promise.all(
        result.files.map(async (file) => {
          const stat = await Filesystem.stat({
            path: `${path}/${file}`,
            directory: Directory.ExternalStorage
          });
          return {
            name: file,
            ...stat
          };
        })
      );

      const total = filesWithStats.reduce((acc, file) => acc + (file.size || 0), 0);
      setTotalSize(total);
      setFiles(filesWithStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading files:', error);
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderStorageChart = (item) => {
    if (!item.size) return null;

    const data = [{
      name: item.name,
      value: item.size
    }, {
      name: 'Remaining',
      value: totalSize - item.size
    }];

    return (
      <div style={{ width: 50, height: 50 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={15}
              outerRadius={25}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{currentPath || 'Arquivos'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        ) : (
          <IonList>
            {files.map((item, index) => (
              <IonItem
                key={index}
                routerLink={item.type === 'directory' ? `/files/${currentPath}/${item.name}`.replace(/\/+/g, '/') : undefined}
              >
                <IonIcon icon={item.type === 'directory' ? folderOpen : document} slot="start" />
                <IonLabel>
                  <h2>{item.name}</h2>
                  <p>{formatBytes(item.size || 0)}</p>
                </IonLabel>
                {item.type === 'directory' && renderStorageChart(item)}
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </>
  );
};

export default FileList;
