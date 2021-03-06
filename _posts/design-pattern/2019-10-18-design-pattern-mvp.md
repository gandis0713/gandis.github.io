---
layout: post
title: "MVP Design Pattern"
subtitle: 'MVP Design Pattern'
author: "Gandis"
header-style: text
tags:
  - Design Pattern
  - C
  - C++
  - QT
---

## **MVP Design Pattern**
MVP 패턴은 MVC(Model View Controller)에서 변형된 Design Pattern으로 Model View Presneter의 약자이다. MVP는 MVC 패턴에서 Controller의 역할이 Presenter로 변경된 것이 주된 차이점이다. 그렇다면 Presenter와 Controller의 역할이 어떻게 다른지를 중점으로 MVP를 한번 알아보자.

MVC 패턴은 정확히 어떻게 구성이 되는지에 대한 의견이 분분하다. 하지만 핵심은, Model과 View는 분리되어 있으며, Model은 View와 Controller의 존재를 알지 못하고, View는 Model과 Controller의 존재를 알지 못한다는 것이다.

MVP 패턴도 마찬가지이다. 단지, Controller가 Presenter로 변경되었을 뿐, Presenter와 View, 그리고 Model이 서로 분리된 형태이다. 즉, Presenter, View, Model로 분리되어 있는 구조를 띄며 아래 그림과 같은 관계를 가진다.

<figure>
	<img src="/../../img/mvp/mvp.png">
</figure>

### **MVP와 MVC의 차이**
MVP와 MVC의 차이는 Presenter와 Controller의 차이로 볼 수 있다.

지금까지 여러가지 MVC 패턴 예제를 보았을 때, MVC의 Controller는 View와 밀접한 관련이 되어있는 것으로 보인다. 아래 링크의 내용을 보면 Controller가 View에 내장(https://doc.qt.io/archives/qq/qq10-mvc.html)되어 있다고 설명하기도 한다. 

그렇다면, Controller는 왜 View와 밀접한 관련이 있을까?

우선 (https://beomy.tistory.com/43)에서는 Controller에서 사용자의 입력(Action)을 받아 Event를 처리하는 것으로 설명하고 있다. Controller가 사용자의 입력을 받는것으로 되어있는데, 특히 PC의 마우스 또는 터치 입력을 받기 위해서는 화면이 필요하다. 즉, Controller는 사용자의 입력을 받기 위해서는 화면(View)과 밀접한 관련이 있게 된다. 

그렇다면 MVP의 Presenter로 View와 밀접한 관련이 있을까?
결론부터 말하면 View와 완전 분리를 할 수 있으며, View뿐만 아니라 View와 관련된 dependency를 완전히 제거할 수 있다.

MVC의 Controller와 마찬가지로 MVP도 Preseter가 View와 Model을 관리한다. 즉, Presenter가 View와 Model을 가지고 있는 형태이다. 하지만 Presenter가 View를 가지고 있게 되면, View의 dependency를 그대로 받게 된다. View의 dependency를 제거하기 위해는 Presenter가 View를 관리하기 위한 기능을 Interface로 정의한 class를 사용하게 되면 된다.

아래의 MVP 패턴으로 구현한 코드를 보면서 확인해 보자.
아래는 데이터를 List에 추가 또는 삭제하는 매우 단순한 어플리케이션 코드이다. QT Framework에서 C++를 사용하여 구현되었다.

### MVP 패턴 구현
**MainWindowView.h**
~~~cpp
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "view/imainwindowview.h"

class CMainWindowPresenter;

namespace Ui {
class CMainWindowView;
}

class CMainWindowView : public QMainWindow, public IMainWindowView
{
    Q_OBJECT

public:
    explicit CMainWindowView(QWidget *parent = 0);
    ~CMainWindowView();

private:
    void Add() override;
    void Delete() override;


private:
    Ui::CMainWindowView *ui;
    CMainWindowPresenter *m_pMainWindowPresenter;
};

#endif // MAINWINDOW_H
~~~

**MainWindowView.cpp**
~~~cpp
#include "cmainwindowview.h"
#include "ui_cmainwindowview.h"

#include "presenter/cmainwindowpresenter.h"

CMainWindowView::CMainWindowView(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::CMainWindowView),
    m_pMainWindowPresenter(NULL)
{
    ui->setupUi(this);

    m_pMainWindowPresenter = new CMainWindowPresenter(this,
                                                      ui->listWidget,
                                                      ui->editNew);

    connect(ui->btnNew, &QPushButton::clicked, this, &CMainWindowView::Add);
    connect(ui->btnDelete, &QPushButton::clicked, this, &CMainWindowView::Delete);
}

CMainWindowView::~CMainWindowView()
{
    delete ui;
}

void CMainWindowView::Add()
{
    m_pMainWindowPresenter->Add();
}
void CMainWindowView::Delete()
{
    m_pMainWindowPresenter->Delete();
}
~~~

**MainWindowPresenter.h**
~~~cpp
#ifndef CMAINWINDOWPRESENTER_H
#define CMAINWINDOWPRESENTER_H

#include <QString>
#include "model/clistmodel.h"

class IMainWindowView;
class IListWidgetView;
class ILineEditView;

class CMainWindowPresenter
{
public:
     CMainWindowPresenter(IMainWindowView *pMainWindow,
                          IListWidgetView *pListView,
                          ILineEditView *pLineEditView);
    virtual ~CMainWindowPresenter();

    void Add();
    void Delete();

private:
    IMainWindowView   *m_pMainWindow;
    IListWidgetView     *m_pListView;
    CListModel     m_listModel;
    ILineEditView *m_pLineEditView;
};

#endif // CMAINWINDOWPRESENTER_H
~~~

**MainWindowPresenter.cpp**
~~~cpp
#include "cmainwindowpresenter.h"

#include "view/imainwindowview.h"
#include "view/ilistwidgetview.h"
#include "view/ilineeditview.h"

CMainWindowPresenter::CMainWindowPresenter(IMainWindowView *pMainWindow,
                                           IListWidgetView *pListView,
                                           ILineEditView *pLineEditView)
    : m_pMainWindow(pMainWindow)
    , m_pListView(pListView)
    , m_pLineEditView(pLineEditView)
{
    // do nothing.
}

CMainWindowPresenter::~CMainWindowPresenter()
{
    // do nothing.
}

void CMainWindowPresenter::Add()
{
    QString strNew = m_pLineEditView->GetText();

    if(strNew.isEmpty())
        return;

    m_listModel.Add(strNew);
    m_pListView->Add(strNew);
    m_pLineEditView->ClearText();
}
void CMainWindowPresenter::Delete()
{
    int nIndex = m_pListView->GetSelectedIndex();
    if(nIndex < 0)
        return;

    m_listModel.Delete(nIndex);
    m_pListView->Delete(nIndex);
}
~~~

**IMainWindowView.h**
~~~cpp
#ifndef IMAINWINDOW_H
#define IMAINWINDOW_H


class IMainWindowView
{
private:
    virtual void Add() = 0;
    virtual void Delete() = 0;
};

#endif // IMAINWINDOW_H
~~~

위 코드에서 보면 MainWindowView class는 QMainWindow를 상속받아 UI dependency를 가지고 있다. 그렇기 때문에 MainWindowViewPresenter가 QMainWindow dependency를 가지게 될 수 있다. 하지만 MainWindowView에서 수행될 대표적인 기능을 정의한 IMainWindowView Interface class도 상속받기 때문에 QMainWindow의 dependency를 피할 수 있다.

MainWindowViewPresenter의 생성자에서도 MainWindowView class를 파라미터로 전달받는 것이 아니라, IMainWindowView Interface를 파라미터로 전달받는다.

이렇게 될경우 Presenter는 View를 가지고 있지만 View의 대한 dependency는 제거된다.

위와 같이 MVP는 MVC와 달리 View와의 관계를 완전히 제거될 수 있다. 이렇게 되면 불필요한 dependency를 포함하지 않은 채 unit test를 진행할 수 있는 장점이 있다.

### **MVP 패턴의 장점**
**-View와 Model의 관계를 완전히 제거할 수 있다.**
**-MVC의 Controller가 가지고 있던 View와의 밀접한 관계를 제거할 수 있어 dependency없이 Presenter, View, Model을 모두 unit test할 수 있다.**
### **MVP 패턴의 단점**
**-MVP와 마찬가지로 최상위 Presenter일 경우 많은 논리 로직이 포함되어야 하며, 시간이 지날 수록 최상위 Presneter의 code양이 어마어마해 질 수 있다.**

### **소스코드**
위에서 예시로 구현한 풀 소스코드는 아래 위치에서 확인 할 수 있다.

<a href="https://github.com/gandis0713/prototype/tree/master/qt/mvp" class="btn">Full Source Code</a>




