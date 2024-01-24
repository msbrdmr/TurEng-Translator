import React, { useState, useEffect } from 'react';
import {
  Input,
  AutoComplete,
  Card,
  Form,
  Button,
  message,
  Table,
  Typography,
  Switch,
  ConfigProvider,
  theme,
  Modal,
  Slider,
} from 'antd';
import axios from 'axios';
import { useLocalStorageState } from './useLocalStorageState';
import './assets/TranslatorPage.css';

const { Text } = Typography;

const TranslatorPage = () => {
  const [searchText, setSearchText] = useState('');
  const [autoCompleteWords, setAutoCompleteWords] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [darkMode, setDarkMode] = useLocalStorageState('darkMode', false);
  const [modalVisible, setModalVisible] = useState(false);
  const [generatedWords, setGeneratedWords] = useState([]);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);

  const columnsTranslate = [
    { key: 'word', title: 'Word', dataIndex: 'word' },
    { key: 'translation', title: 'Translation', dataIndex: 'translation' },
    { key: 'type', title: 'Type', dataIndex: 'type' },
  ];

  const columnsGenerate = [
    { key: 'key', title: 'Number', dataIndex: 'key' },
    { key: 'word', title: 'Word', dataIndex: 'word' },
  ];

  const generateWords = async () => {
    try {
      setGenerateLoading(true);
      const response = await axios.post('http://localhost:3000/random-words', {});
      setGeneratedWords(response.data.map((word, index) => ({ key: index + 1, word: word.word })));
      setGenerateLoading(false);
      setModalVisible(true);
    } catch (error) {
      console.error('Error generating random words:', error);
      setGenerateLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onSearch = async (value) => {
    if (!value.trim()) {
      setAutoCompleteWords([]);
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/autocomplete-words', {
        searchText: value,
      });
      setAutoCompleteWords(response.data.map((wordObj) => ({ value: wordObj.word })));
    } catch (error) {
      message.error('Error fetching autocomplete words!');
    }
  };

  const onSelect = (value) => {
    setSearchText(value);
  };

  const submitTranslateWord = async (values) => {
    const wordToTranslate = values.word;
    try {
      setTranslateLoading(true);
      const response = await axios.post(`http://localhost:3000/translate`, {
        word: wordToTranslate,
      });
      let x = 0;
      const tableData = response.data.map((currentValue) => ({
        key: x++,
        word: wordToTranslate,
        translation: currentValue.translation,
        type: currentValue.typeName,
      }));
      setTranslations(tableData);
      setTranslateLoading(false);
    } catch (error) {
      console.error('Error translating:', error);
      setTranslateLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#333' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

  const darkModeChange = (checked) => {
    setDarkMode(checked);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 5,
            color: darkMode ? '#fff' : '#000',
          }}
        >
          <Text style={{ marginRight: 10 }}>Dark Mode</Text>
          <Switch value={darkMode} onChange={darkModeChange} />
          <Button
            onClick={generateWords}
            loading={generateLoading}
            style={{
              marginLeft: 'auto',
              outline: 'none',
            }}
          >
            Generate Random Words
          </Button>
          <Modal title="Words" visible={modalVisible} onCancel={handleCancel} footer={null} width={'fit-content'}>
            {generatedWords.length === 0 ? (
              <></>
            ) : (
              <div
                style={{
                  width: 300,
                  marginTop: 20,
                  borderRadius: 10,
                  padding: 10,
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.4)',
                  background: darkMode ? '#444' : '#fff',
                }}
              >
                <Table bordered pagination={false} dataSource={generatedWords} columns={columnsGenerate} />
              </div>
            )}
          </Modal>
        </div>
        <div
          style={{
            padding: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkMode ? '#fff' : '#000',
          }}
        >
          <Card
            title="Translator"
            style={{
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.4)',
              width: 320,
            }}
          >
            <Form onFinish={submitTranslateWord}>
              <Form.Item name="word" rules={[{ required: true, message: 'Please enter a word!' }]}>
                <AutoComplete
                  options={autoCompleteWords}
                  onSelect={onSelect}
                  onSearch={onSearch}
                  autoComplete="off"
                >
                  <Input placeholder="Enter word" />
                </AutoComplete>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ outline: 'none' }} loading={translateLoading}>
                  Translate
                </Button>
              </Form.Item>
            </Form>
          </Card>
          {translations.length === 0 ? (
            <></>
          ) : (
            <div
              style={{
                width: 300,
                marginTop: 20,
                borderRadius: 10,
                padding: 10,
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.4)',
                background: darkMode ? '#444' : '#fff',
              }}
            >
              <Table bordered pagination={false} dataSource={translations} columns={columnsTranslate} />
            </div>
          )}
        </div>
      </>
    </ConfigProvider>
  );
};

export default TranslatorPage;