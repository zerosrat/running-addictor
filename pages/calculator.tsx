import React, { useState }  from "react";
import { NumberInput, Table, Flex, Space } from "@mantine/core";
import { useLocalStorage } from '@mantine/hooks'

const karvonenFormula = (mhr = 0, rhr = 0, percentage: number) => {
  // 储备心率=静息心率+(最大心率-静息心率)*目标心率区间的百分比
  return rhr + (mhr - rhr) * percentage
}

/**
 * E 轻松跑区间59%-74%储备心率 137-156
 * M 马拉松配速区间74%-84%储备心率 156-168
 * T 乳酸阈值区间84%-88%储备心率 168-173
 * A 无氧耐力区间88%-95%储备心率 173-182
 * I 最大摄氧区间95%-100%储备心率 182+
 */
const runnerConfig = [{
  title: 'E (Easy running) 轻松跑',
  low: 0.59,
  high: 0.74,
}, {
  title: 'M (Marathon-pace running) 马拉松配速跑',
  low: 0.74,
  high: 0.84
}, {
  title: 'T (Threshold running) 乳酸门槛跑',
  low: 0.84,
  high: 0.88
}, {
  title: 'A (Anaerbic running) 无氧耐力跑',
  low: 0.88,
  high: 0.95
}, {
  title: 'I (Interbval training) 间歇训练',
  low: 0.95,
  high: 1
}]

const Calculator = () => {
  const [mhr, setMhr] = useLocalStorage<number>({
    key: 'mhr',
    defaultValue: 190,
  });
  const [rhr, setRhr] = useLocalStorage<number>({
    key: 'rhr',
    defaultValue: 60,
  });

  const rows = runnerConfig.map((element) => {
    const lhr = Math.round(karvonenFormula(mhr, rhr, element.low))
    const hhr = Math.round(karvonenFormula(mhr, rhr, element.high))
    return (
      <tr key={element.title}>
        <td>{element.title}</td>
        <td>{element.low * 100 + '%'} - {element.high * 100 + '%'}</td>
        <td>{lhr} - {hhr}</td>
      </tr>
    )
  });

  return (
    <div>
      <Space h="xl" />
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
      >
        <NumberInput
          value={mhr}
          onChange={v => setMhr(+v)}
          label="Your Max Heart Rate"
          withAsterisk
        />
        <NumberInput
          value={rhr}
          onChange={v => setRhr(+v)}
          label="Your Rest Heart Rate"
          withAsterisk
        />
      </Flex>

      <Space h="sm" />

      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Intensity Zones</th>
            <th>Heart Rate</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  )
}

export default Calculator