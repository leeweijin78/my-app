import "./App.css";
import { useState } from "react";
import { Alert, Button, Col, Layout, Modal, Row, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";

import SpinningWheel from "./components/SpinningWheel/SpinningWheel";

const mockPrize = [
  { name: "Prize 1", probability: 0.2, color: "red" },
  { name: "Prize 2", probability: 0.1, color: "blue" },
  { name: "Prize 3", probability: 0.15, color: "green" },
  { name: "Prize 4", probability: 0.15, color: "yellow" },
  { name: "Prize 5", probability: 0.2, color: "purple" },
  { name: "Prize 6", probability: 0.2, color: "orange" },
];

const RulesModal = ({ onCancel }) => {
  return (
    <Modal open onCancel={onCancel} title="抽奖规则" footer={null}>
      <div>1. 没有抽奖次数不能参与</div>
      <div>2. 未登入，不能参与</div>
    </Modal>
  );
};

const RewardHistoryModal = ({ mockUser, onCancel }) => {
  return (
    <Modal open onCancel={onCancel} title="中奖记录" footer={null}>
      {mockUser[0].reward.length === 0 ? (
        <div>暂无中奖记录</div>
      ) : (
        mockUser[0].reward.map((reward, index) => (
          <div key={index}>
            {index + 1}. Prize: {reward.name}, Date:{" "}
            {reward.rewardDate.toLocaleString()}
          </div>
        ))
      )}
    </Modal>
  );
};

function App() {
  const [mockUser, setMockUser] = useState([
    { name: "James", drawLeft: 2, reward: [] },
  ]);
  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [isRewardHistoryModalVisible, setIsRewardHistoryModalVisible] =
    useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleOnLogin = () => {
    if (!isLogin) {
      setIsLogin(true);
      message.success("登陆成功");
    } else {
      setIsLogin(false);
      message.success("退出成功");
    }
  };

  const handleDecrementDrawLeft = () => {
    const totalProbability = mockPrize.reduce(
      (acc, prize) => acc + prize.probability,
      0
    );
    const randomNum = Math.random() * totalProbability;

    let cumulativeProbability = 0;
    let selectedPrize;
    for (const prize of mockPrize) {
      cumulativeProbability += prize.probability;
      if (randomNum < cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }

    setSelectedPrize(selectedPrize);
    setIsSpinning(true);

    setMockUser((prevUser) => {
      const updatedUser = [
        {
          ...prevUser[0],
          drawLeft: prevUser[0].drawLeft - 1,
          reward: [
            { name: selectedPrize.name, rewardDate: new Date() },
            ...prevUser[0].reward,
          ],
        },
      ];
      console.log(updatedUser);
      return updatedUser;
    });
  };

  const handleSpinEnd = () => {
    setIsSpinning(false);
    message.success(`恭喜! 您赢得了: ${selectedPrize.name}`);
  };

  return (
    <Layout className="App">
      <Header
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          color: "white",
        }}
      >
        <Button style={{ float: "right" }} onClick={handleOnLogin}>
          {!isLogin ? "登陆" : "退出"}
        </Button>
      </Header>
      <Content>
        <h1>幸运大转盘</h1>
        <SpinningWheel
          prizes={mockPrize}
          selectedPrize={selectedPrize}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
        />
        <Row style={{ marginTop: 16 }} justify="center" gutter={[8, 8]}>
          <Col>
            <Alert
              type="info"
              message={`您还有${mockUser[0].drawLeft}次抽奖机会`}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              onClick={handleDecrementDrawLeft}
              disabled={!isLogin || mockUser[0].drawLeft === 0 || isSpinning}
            >
              抽奖
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => setIsRulesModalVisible(true)}>
              抽奖规则
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => setIsRewardHistoryModalVisible(true)}
            >
              抽奖记录
            </Button>
          </Col>
        </Row>
      </Content>
      {isRulesModalVisible && (
        <RulesModal onCancel={() => setIsRulesModalVisible(false)} />
      )}
      {isRewardHistoryModalVisible && (
        <RewardHistoryModal
          mockUser={mockUser}
          onCancel={() => setIsRewardHistoryModalVisible(false)}
        />
      )}
    </Layout>
  );
}

export default App;
