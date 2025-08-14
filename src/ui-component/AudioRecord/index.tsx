import { useState, useRef } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _isNil from 'lodash/isNil';

import { DeleteIcon, MicIcon } from '../../assets/icons';
import { pauseBtnAudio, playBtnAudio } from '../../assets/images';
import { toasts, Text, ModalMethods, Modal } from '../../ui-component/';

import {
  AudioRecordContainer,
  AddAudioContainer,
  LabelContainer,
  HelpText,
  RecordModalBody,
} from './style';

export type ImageObjType = {
  reference_id: string;
  short_lived_url: string;
};

export type AudioRecordProps = {
  label?: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  value?: Array<ImageObjType> | ImageObjType;
  accept?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  errorMessage?: string;
  maxUpload?: number;
  onUpload: (audioFile: Blob) => void;
  handleDeleteAudio: (audioRefId: string) => void;
};

let timerId: any = null;

const AudioRecord = (props: AudioRecordProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modalRef = useRef<ModalMethods>(null);

  const [timer, setTimer] = useState(0);

  const minutes = parseInt((timer / 60).toString()).toString();
  const seconds = (timer % 60).toString();

  const {
    label = '',
    className = '',
    value = [],
    multiple = false,
    maxUpload = 1,
    disabled = false,
    required = false,
    errorMessage = '',
    onUpload,
    handleDeleteAudio,
  } = props;

  const hasError = !_isEmpty(errorMessage);

  const showAddAudio =
    !disabled && (multiple && _isArray(value) ? value.length < maxUpload : _isEmpty(value));

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        setAudioChunks((prevChunks) => [...prevChunks, e.data]);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'accessing-audio-stream-error');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleStartRecording = () => {
    timerId = setInterval(() => setTimer((prevTimer) => prevTimer + 1), 1000);
    startRecording();
  };

  const handleStopRecording = () => {
    clearInterval(timerId);
    stopRecording();
  };

  const handleModalDataSave = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
    setAudioChunks([]);

    handleCloseModal();
    onUpload(audioBlob);
  };

  const handleCloseModal = () => {
    setTimer(0);
    clearInterval(timerId);

    modalRef.current?.hide();
  };

  return (
    <AudioRecordContainer className={className}>
      {!_isEmpty(label) && (
        <>
          <LabelContainer>
            <Text color="black" fontWeight={500}>
              {label}
            </Text>
            {required && (
              <Text color="black" className="mandatory">
                *
              </Text>
            )}
          </LabelContainer>
          <HelpText size="small">{`You can upload maximum ${maxUpload} Audio Recordings.`}</HelpText>
        </>
      )}

      {showAddAudio && (
        <AddAudioContainer onClick={() => modalRef.current?.show()}>
          <MicIcon />
          <Text color="primary">Record</Text>
        </AddAudioContainer>
      )}

      <Modal
        ref={modalRef}
        title="Record Audio"
        isSaveEnabled={!isRecording && audioChunks.length !== 0}
        onModalClose={handleCloseModal}
        onModalSuccess={handleModalDataSave}
      >
        <RecordModalBody>
          {isRecording ? (
            <div onClick={handleStopRecording}>
              <img src={playBtnAudio} className="audio-btn-style" alt="play-btn" />
            </div>
          ) : (
            <div onClick={handleStartRecording}>
              <img src={pauseBtnAudio} className="audio-btn-style" alt="pause-btn" />
            </div>
          )}

          <Text color="primary">
            {`${minutes.length === 1 ? `0${minutes}` : minutes} : ${
              seconds.length === 1 ? `0${seconds}` : seconds
            }`}
          </Text>

          {isRecording ? (
            <Text fontWeight={600}>Please start speaking, your voice is being recorded</Text>
          ) : (
            <Text fontWeight={600}>Click on the play button to start recording</Text>
          )}
        </RecordModalBody>
      </Modal>

      {hasError && (
        <Text color="red" size="small">
          {errorMessage}
        </Text>
      )}

      {!_isNil(value) && !_isEmpty(value) && (
        <div className="audio-container">
          {_isArray(value) &&
            value.length > 0 &&
            value.map((audioFile) => (
              <div key={audioFile.reference_id} className="audio-item">
                <audio controls>
                  <source src={audioFile.short_lived_url} type="audio/mpeg"></source>
                </audio>
                {!disabled && (
                  <div
                    className="delete-btn"
                    onClick={() => handleDeleteAudio(audioFile.reference_id)}
                  >
                    <DeleteIcon />
                  </div>
                )}
              </div>
            ))}

          {!_isArray(value) && (
            <div key={value.reference_id} className="audio-item">
              <audio controls>
                <source src={value.short_lived_url} type="audio/mpeg"></source>
              </audio>
              {!disabled && (
                <div className="delete-btn" onClick={() => handleDeleteAudio(value.reference_id)}>
                  <DeleteIcon />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {disabled && (_isNil(value) || _isEmpty(value)) && <Text>No Audio Uploaded</Text>}
    </AudioRecordContainer>
  );
};

export default AudioRecord;
