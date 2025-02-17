import React, { useCallback, useEffect, useState } from 'react';
import { Button, ConfigProvider, message, Modal, notification, Space, Tooltip } from 'antd';
import i18n from '@/i18n';
import { IconType } from 'antd/es/notification/interface';
import Iconfont from '../Iconfont';
import { copy, getApplicationMessage } from '@/utils'
import styles from './index.less';

interface IProps {
  type?: IconType;
  message?: React.ReactNode;
  /** 错误代码 */
  errorCode: string;
  /** 错误信息 */
  errorMessage: string;
  /** 错误详情 */
  errorDetail: string;
  /** 问题wiki路径 */
  solutionLink: string;
  /** 请求的接口 */
  requestUrl: string;
  /** 请求的参数 */
  requestParams: string;
}

function MyNotification() {
  const [notificationApi, notificationDom] = notification.useNotification({
    maxCount: 2,
  });
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<IProps>();

  window._notificationApi = useCallback((props: IProps) => {
    const { errorCode, errorMessage, errorDetail, solutionLink } = props;
    setProps(props);
    const btn = (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          {i18n('common.notification.detail')}
        </Button>
        <Button type="link" size="small" target="_blank" href={solutionLink}>
          {i18n('common.notification.solution')}
        </Button>
      </Space>
    );

    const renderDescription = () => {
      return (
        <div className={styles.description}>
          {props.errorCode} {props.errorMessage}
        </div>
      );
    };

    const renderMessage = () => {
      return (
        <div className={styles.message}>
          <Iconfont code="&#xe60c;" />
          Error
        </div>
      );
    };

    notificationApi.open({
      className: styles.notification,
      message: renderMessage(),
      description: renderDescription(),
      placement: 'bottomRight',
      btn,
    });
  }, []);

  function renderModalTitle() {
    return <div className={styles.modalTitle}>
      {`${props?.errorCode}：${props?.errorMessage} `}
    </div>
  }

  function copyError() {
    const errorMessage = {
      getApplicationMessage: getApplicationMessage(),
      ...props,
    }
    copy(JSON.stringify(errorMessage))
    message.success(i18n('common.button.copySuccessfully'))
  }

  function renderModalFooter() {
    return <div className={styles.modalFooter} onClick={copyError}>
      <Iconfont code="&#xeb4e;" />{i18n('common.button.copyError')}
      <span className={styles.copyErrorTips}>{i18n('common.button.copyErrorTips')}</span>
    </div>
  }

  return (
    <>
      {notificationDom}
      <Modal
        className={styles.modal}
        title={renderModalTitle()}
        open={open}
        width="70vw"
        footer={renderModalFooter()}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <div className={styles.errorDetail}>
          {props?.errorDetail}
        </div>
      </Modal>
    </>
  );
}

export default MyNotification;
